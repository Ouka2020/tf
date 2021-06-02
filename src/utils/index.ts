import * as ExcelJS from "exceljs"
import moment from "moment";

type PostData = BodyInit | {}

/**
 * 加载样式表文件
 * @param url css file URL
 */
export function loadStyle(url: string): void {
    const head = document.querySelector('head');
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    link.media = 'screen';
    head.appendChild(link);
}

export class ThreeFei {
    //消息父节点
    elementSelector: HTMLDivElement
    //最大处理数量
    maxRecords: string = "200"
    //取消标记
    cancelMarker: boolean = false
    //工作表id
    sheetIndex: string[] = []
    //工作表内容
    sheetsValues: object[][] = []
    //最终的字段名集合
    finalColumnSet: Set<string> = new Set<string>()
    //最终的工作表内容
    finalData: {}[] = [{}]
    //地市
    readonly pregId = new Map<string, string>([["深圳", "13de0ce67f2742c3bbed3b16ecccabd5"]])
    //区域
    readonly regId = new Map<string, string>([
        ["盐田区", "088d8d4b838a4cb78a3d31cb1acac7dd"],
        ["南山区", "2ab78f6689ee48e9abb657ff10e0c13c"],
        ["深汕特别合作区", "2d0d2b4110b845889b001c9dd6eb6a10"],
        ["罗湖区", "3a5f327ce60442d3b4a053c4d08771ce"],
        ["宝安区", "4f59546229a7490da7b4f986f8e5dae7"],
        ["龙岗区", "6c0875ba3d3a47059f300aad39643244"],
        ["福田区", "6ffd8b27bb64453591d0eaa9f9f8f74d"],
        ["龙华新区", "a80424ab72164349b69cc90a03fe084f"],
        ["坪山区", "accb8a80f6af46d1945753c85d31af50"],
        ["光明区", "b2cda2132cd4431b989f0735003bc922"],
        ["大鹏新区", "dd2c1980c1f2412aa7ecab7531fe840d"]
    ])
    //归属
    readonly belongDept = new Map<string, string>([["深圳无线优化中心", "9c9e3ac427f642308c79ba822dd026e8"]])

    constructor(selector: string) {
        this.elementSelector = document.querySelector(`#${selector}_resultDisplay div.panel-body`)
    }

    /**
     * 往目标节点输出信息。子节点为段落(p)。
     * @param msg 消息内容，可以是html内容。
     */
    appendMessage(msg: string): void {
        const childElement = document.createElement('p')
        childElement.className = 'text-left'
        childElement.innerHTML = msg
        this.elementSelector.appendChild(childElement)
    }

    /**
     * 生成上传文件队列
     * @param code 用于生成文档id
     * @param attaches 要上传的文件列表，逗号分隔符分开
     * @param files 附件清单
     */
    createUploadWorks(code: string, attaches: string, files: FileList): Promise<void>[] {
        const uploadWorks: Promise<void>[] = []

        for (let index = 0; index < files.length; index++) {
            const _file = files[index] as File
            if (checkAttachNeedUpload(attaches, _file.name)) {
                const formData = new FormData()
                formData.append("contractId", code)
                formData.append("id", `WU_FILE_${index}`)
                formData.append("name", _file.name)
                formData.append("type", _file.type)
                formData.append("lastModifiedDate", moment(_file.lastModified).format()) //todo: 日期格式化内容
                formData.append("size", _file.size.toString())
                formData.append("file", _file)

                let spanId = `${code}_progress_${index}`
                this.appendMessage(`上传文件 ${files[index].name} <span id="${spanId}"></span>。`)
                let spanSelector = this.elementSelector.querySelector(`#${spanId}`)

                // 添加到上传队列
                uploadWorks.push(uploadFile('/NCMS/asserts/tpl/selfrent/billaccount_m/uploadFile', formData, spanSelector))
            }
        }

        return uploadWorks
    }

    /**
     * 清除消息节点
     */
    clearElement(): void {
        this.elementSelector.innerHTML = ''
    }

    /**
     * 选择工作表，并更新最终数据及字段名称
     * @param sheetId
     */
    selectSheetData(sheetId: string): void {
        this.finalData = this.sheetsValues[sheetId]

        const _tempList = new Set<string>()
        for (let rowData in this.finalData[0]) {
            _tempList.add(rowData)
        }

        _tempList.delete('id')
        this.sheetIndex = []
        this.sheetsValues = []

        this.finalColumnSet = _tempList
    }
}

/**
 * 字符串工厂
 */
export class StringBuilder {
    __stringArr__: string[] = []

    /**
     * 增加内容
     * @param str 内容，可以使用占位符'{0}'
     * @param args 占位符内容
     */
    append(str: string, ...args: any[]) {
        for (let i = 0; i < args.length; i++) {
            const reg = new RegExp(`\\{${i}\\}`, "g")
            str = str.replace(reg, args[i])
        }
        this.__stringArr__.push(str)
    }

    /**
     * 输出完整的字符串
     */
    toString() {
        return this.__stringArr__.join("")
    }

    /**
     * 清除字符串
     */
    clear() {
        this.__stringArr__ = []
    }
}

/**
 * 将所有的行数据转换为json
 * @param worksheet 工作表对象
 */
export async function changeRowsToDict(worksheet: ExcelJS.Worksheet) {
    /**
     * 转换单元格对象到字典
     * @param keys 列集合
     * @param row 行对象
     */
    function cellValueToDict2(keys: ExcelJS.CellValue[] | { [p: string]: ExcelJS.CellValue }, row: ExcelJS.Row) {
        let data: { [p: string]: ExcelJS.CellValue } = {}
        row.eachCell((cell, colNumber) => {
            let value: ExcelJS.CellValue | { error: ExcelJS.CellErrorValue } // 取值

            // 根据类型进行转换
            switch (cell.type) {
                // case ExcelJS.ValueType.Boolean:
                //     value = cell.value as boolean
                //     break
                // case ExcelJS.ValueType.Date:
                //     value = cell.value as Date
                //     break
                // case ExcelJS.ValueType.Error:
                //     value = (cell.value as ExcelJS.CellErrorValue).error
                //     break
                case ExcelJS.ValueType.Formula:
                    if (cell.formulaType === ExcelJS.FormulaType.Shared)
                        value = (cell.value as ExcelJS.CellSharedFormulaValue).result
                    else
                        value = (cell.value as ExcelJS.CellFormulaValue).result

                    break
                //case ExcelJS.ValueType.Hyperlink:
                //case ExcelJS.ValueType.Merge:
                //case ExcelJS.ValueType.Null:
                // case ExcelJS.ValueType.Number:
                //     value = cell.value as number
                //     break
                case ExcelJS.ValueType.RichText:
                    let k = (cell.value as ExcelJS.CellRichTextValue).richText
                    let r: string[] = []
                    for (let i = 0; i < k.length; i++) {
                        r.push(k[i].text)
                    }
                    value = r.join('')
                    break
                //case ExcelJS.ValueType.SharedString:
                //case ExcelJS.ValueType.String:
                default:
                    value = cell.value
            }
            if (typeof value === "object") {
                if (value.hasOwnProperty('error'))
                    value = (value as ExcelJS.CellErrorValue).error
            }

            data[keys[colNumber]] = value as ExcelJS.CellValue
        })
        return data
    }

    let dataArray: {}[] = [{}]
    let keys: ExcelJS.CellValue[] | { [key: string]: ExcelJS.CellValue }
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
            keys = row.values
        } else {
            dataArray.push(cellValueToDict2(keys, row))
        }
    })

    // 删除第1行标题
    dataArray.splice(0, 1)
    return dataArray
}

/**
 * 异步发送POST请求，可上传文件，注意设置参数对象。
 * @param url 目标地址
 * @param data 参数集合
 */
export async function post(url: string, data?: PostData): Promise<{}> {
    let finalData: BodyInit = null
    if (data) {
        if (typeof data === "object") {
            if (data instanceof FormData || data instanceof URLSearchParams) {
                finalData = data
            } else {
                finalData = new URLSearchParams()
                for (const dataKey in (data as {})) {
                    if (typeof data[dataKey] === "object")
                        finalData.append(dataKey, JSON.stringify(data[dataKey]))
                    else
                        finalData.append(dataKey, data[dataKey])
                }
            }
        }
    }

    const response = await fetch(url, {
        method: "POST",
        body: finalData
    })

    return response.json()
}

/**
 * 异步上传文件
 * @param url 目标地址
 * @param data 参数
 * @param displayElement 进度回显节点
 */
export async function uploadFile(url: string, data: FormData, displayElement: Element) {
    await new Promise((resolve, reject) => {
        let r = new XMLHttpRequest()
        r.responseType = 'json'
        r.open('POST', url)
        r.upload.addEventListener('progress', (e) => {
            //const progressRate = Math.floor((e.loaded / e.total) * 100) + '%'
            displayElement.innerHTML = Math.floor((e.loaded / e.total) * 100) + '%' //progressRate
        })
        r.addEventListener('load', () => {
            resolve(r.response)
        })
        r.addEventListener('error', () => {
            reject({
                status: r.status,
                statusText: r.statusText
            })
        })
        r.send(data)
    })
}

/**
 * Set转字符串，分隔符为‘,’
 * @param s Set对象
 * @param ext 额外字符串
 */
export function setToString(s: Set<string>, ext?: string): string {
    let l: string[] = []
    for (const v of s) {
        if (ext)
            l.push(v + ext)
        else
            l.push(v)
    }
    return l.join(',')
}

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

//工作本对象
export const excel = new ExcelJS.Workbook()
