
/** 生成随机字符串 */
function randomChar (codeLength = 10) {
  const area = '0123456789QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm'
  const areaLength = area.length

  let codeText = ''
  for (let i = 0; i < codeLength; i++) {
    const ran = Math.round(Math.random() * (areaLength - 0) + 0)
    codeText += area.charAt(ran)
  }
  return codeText
}

/** 数组引用去重 */
function arrUniq<T> (arr: T[], condition: (a: T, b: T) => boolean) {
  for (let i = 0; i < arr.length; i++) {
    const it = arr[i]

    // 通过删除重复项目的方式合并同类项
    for (let j = i + 1; j < arr.length; j++) {
      const item = arr[j]
      if (condition(it, item)) {
        arr.splice(j, 1)
        j--
      }
    }
  }
  return arr
}

const libs = {
  randomChar,
  arrUniq,
}

export default libs