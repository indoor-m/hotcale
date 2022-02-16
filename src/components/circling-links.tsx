import React, { ChangeEvent, useEffect, useState } from 'react'
import { Container, Draggable } from 'react-smooth-dnd'
import { arrayMoveImmutable } from 'array-move'

interface Props {
  background_color?: string
  w?: string
  placeholder?: string
  value?: string[]
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  setValue?: (values: string[]) => void
}

interface Prop {
  removedIndex: number
  addedIndex: number
}

const CirclingLinks: React.FC<Props> = React.forwardRef<
  HTMLInputElement,
  Props
>(({ value = [], setValue }, _) => {
  interface Item {
    id: string
    text: string
    order: number
  }

  //巡回リンクのリスト
  const [items, setItems] = useState<Item[] | null>(null)

  useEffect(() => {
    const values = value.map((v, i): Item => {
      return { id: i.toString(), text: v, order: i }
    })

    setItems(values)
  }, [])

  // TODO: 存在しないときの処理
  if (items == null) {
    return <></>
  }

  // ドラッグアンドドロップをする処理
  const onDrop = ({ removedIndex, addedIndex }: Prop) => {
    const newItems = [...items]
    // イベントで渡された要素の移動を state に伝えます。
    // この際、ライブラリで配列中の要素を移動、各要素のプロパティに現在のインデックスを付与、としています。
    if (removedIndex != newItems.length) {
      const updater = (newItems: Item[]) =>
        arrayMoveImmutable(newItems, removedIndex, addedIndex).map(
          (newItems: Item, idx) => {
            return { ...newItems, order: idx }
          }
        )

      setItems(updater)
      setValue(updater(items).map((v) => v.text))
    }
    console.log(newItems)
  }

  // 巡回リンクを追加し、enterを押したときの処理
  const onAddText = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key == 'Enter') {
      const newItems = [...items]

      if (event.currentTarget.value.length != 0) {
        const values = [
          ...newItems,
          {
            id: String(Number(newItems.length) + 1),
            text: event.currentTarget.value,
            order: newItems.length,
          },
        ]

        // items配列の最後に追加
        setItems(values)
        setValue(values.map((v) => v.text))

        event.currentTarget.value = ''
      }
    }
  }

  // URLを変更した時にuseStateを更新
  const onChangeText = (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const newItems = [...items]
    const targetCirclingLinksIndex = newItems.findIndex((v) => v.id === id)

    // idがない場合-1がtargetCirclingLinksIndexに代入されるのでそれをはぶく
    if (targetCirclingLinksIndex === -1) {
      return
    }
    if (targetCirclingLinksIndex != newItems.length) {
      // items配列の最後以外が変更された場合
      // 変更した内容を更新
      newItems[targetCirclingLinksIndex].text = event.target.value
      setItems(newItems)
    }

    setValue(newItems.map((v) => v.text))
    console.log(newItems)
  }

  // inputのフォーカスが離れた時の処理
  const onClearText = (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const newItems = [...items]
    // inputの中がからの場合削除
    if (Number(id) != newItems.length - 1 && event.target.value.length == 0) {
      // idのindex番号
      const targetCirclingLinksIndex = newItems.findIndex((v) => v.id === id)

      // idがない場合-1がtargetCirclingLinksIndexに代入されるのでそれをはぶく
      if (targetCirclingLinksIndex === -1) {
        return
      }
      // idから１要素を削除
      newItems.splice(targetCirclingLinksIndex, 1)

      // newItemsのorderを変更
      for (let i = targetCirclingLinksIndex; i < newItems.length; i++) {
        console.log(newItems[i].order + ':')
        newItems[i].order = i
      }
      // 配列を更新
      setItems(newItems)
      setValue(newItems.map((v) => v.text))

      // ログを表示
      console.log(newItems)
    }
  }

  // 巡回リンクの×ボタンを押したときにinputを削除する
  const onDeleteText = (id: string) => {
    const newItems = [...items]

    // idのindex番号
    const targetCirclingLinksIndex = newItems.findIndex((v) => v.id === id)

    // idがない場合-1がtargetCirclingLinksIndexに代入されるのでそれをはぶく
    if (targetCirclingLinksIndex === -1) {
      return
    }
    // idから１要素を削除
    newItems.splice(targetCirclingLinksIndex, 1)

    // newItemsのorderを変更
    for (let i = targetCirclingLinksIndex; i < newItems.length; i++) {
      console.log(newItems[i].order + ':')
      newItems[i].order = i
    }
    // 配列を更新
    setItems(newItems)
    setValue(newItems.map((v) => v.text))

    // ログを表示
    console.log(newItems)
  }

  return (
    <>
      <ul>
        {items.length != 0 && (
          <Container dragHandleSelector=".dragHandleSelector" onDrop={onDrop}>
            {items.map(({ id, text }) => (
              <Draggable key={id}>
                <div className="w-full flex my-1 pb-1">
                  <img
                    src="/assets/icons/edit.svg"
                    alt="編集ボタン"
                    className={`dragHandleSelector h-4 w-auto my-auto select-none`}
                  />
                  <input
                    type="text"
                    className="border-2 rounded-md flex-grow px-2 py-[2px] mx-2 focus:outline-none focus:border-mainColor focus:bg-white"
                    defaultValue={text}
                    onChange={onChangeText.bind(this, id)}
                    // URLを消してフォーカスが外れた時の処理
                    onBlur={onClearText.bind(this, id)}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mt-[3px] flex text-captionColor"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    onClick={onDeleteText.bind(this, id)}
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </Draggable>
            ))}
          </Container>
        )}
        <div
          className={`${
            items.length != 0 && 'border-t-2 pt-3'
          } w-full flex my-1`}
        >
          <div className="w-[8px]" />
          <input
            type="text"
            className="border-2 rounded-md flex-grow px-2 py-[2px] mx-2 focus:outline-none focus:border-mainColor focus:bg-white"
            placeholder="巡回したいリンクを入力してください"
            onKeyPress={onAddText}
          />
          <div className="w-5 flex" />
        </div>
      </ul>
    </>
  )
})

CirclingLinks.displayName = 'CirclingLinks'

export default CirclingLinks
