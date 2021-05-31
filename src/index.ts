/**
 * 判断附件是否需要上传
 * @param attachList 文件清单
 * @param testName 待测试文件名
 */
export function checkAttachNeedUpload(attachList: string, testName: string) {
    if (attachList === undefined || attachList === null)
        return false

    let attaches = attachList.split(',')
    for (let i = 0; i < attaches.length; i++) {
        if (testName === attaches[i])
            return true
    }

    return false
}

