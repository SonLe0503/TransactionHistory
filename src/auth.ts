const CURRENT_DOMAIN = "online.mbbank.com.vn"
const URL_DEFAULT_MB = [
  "https://online.mbbank.com.vn/api/retail_web/loyalty/getBalanceLoyalty",
  "https://online.mbbank.com.vn/api/retail-web-accountms/getBalance",
  "https://online.mbbank.com.vn/api/retail-web-onlineloanms/loan/getList",
  "https://online.mbbank.com.vn/api/retail_web/internetbanking/getFavorBeneficiaryList"
]

interface RequestHeader {
  method: string
  url: string
  requestsHeader: { name: string; value: string }[]
}

interface Request {
  url: string
  queryParams?: string
  postData?: string
  method: string
  time: string
  requestHeader?: { name: string; value: string }[]
}

interface AuthInfo {
  body: any
  headers: { name: string; value: string }[]
}

function parseTime(timeStr: string) {
  const [time, period] = timeStr.split(" ")
  const [hours, minutes, seconds] = time.split(":")

  let hour = parseInt(hours)
  if (period === "PM" && hour !== 12) {
    hour += 12
  } else if (period === "AM" && hour === 12) {
    hour = 0
  }

  const today = new Date()
  today.setHours(hour, parseInt(minutes), parseInt(seconds))
  return today
}

const getStorageData = (key: string): Promise<any[]> =>
  new Promise((resolve) =>
    chrome.storage.local.get(key, (data) => resolve(data[key] || []))
  )

export const merRequests = async (): Promise<AuthInfo | null> => {
  try {
    const [requests, requestsHeader] = await Promise.all([
      getStorageData("requests"),
      getStorageData("requestsHeader")
    ])
    const filteredRequests = (requests as Request[]).filter(req => 
      req.url.includes(CURRENT_DOMAIN) &&
      URL_DEFAULT_MB.includes(req.url)
    )
    const seenUrls = new Set()
    const requestPost = filteredRequests.filter((elm) => {
      const { url, queryParams, postData } = elm
      return (
        (queryParams || postData) &&
        !queryParams?.includes("v=") &&
        !seenUrls.has(url) &&
        seenUrls.add(url)
      )
    })

    const requestMerge = requestPost.map((elm) => {
      const findHeader = (requestsHeader as RequestHeader[]).find(
        (item) => elm.method === item.method && elm.url === item.url
      )
      if (findHeader) {
        return { ...elm, requestHeader: findHeader.requestsHeader}
      }
      return elm
    })

    const requestMergePost = requestMerge.reduce(
      (latest, current) => {
        if (!latest) return current
        const latestTime = parseTime(latest.time)
        const currentTime = parseTime(current.time)

        return currentTime > latestTime ? current : latest
      },
      null as Request | null
    )

    if (!requestMergePost) return null
    const postData = JSON.parse(requestMergePost.postData || "null") ?? ""
    const headers = requestMergePost.requestHeader ?? []

    return { body: postData, headers }
  } catch (error) {
    console.error(error)
    return null
  }
}
