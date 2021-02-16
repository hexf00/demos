
/** 生成随机字符串 */
function randomChar(codeLength = 10) {
  const area = '0123456789QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm'
  const areaLength = area.length

  let codeText = ''
  for (let i = 0; i < codeLength; i++) {
    const ran = Math.round(Math.random() * (areaLength - 0) + 0)
    codeText += area.charAt(ran)
  }
  return codeText
}

const libs = {
  randomChar,
}

export default libs