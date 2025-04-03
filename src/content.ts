import type { PlasmoCSConfig } from "plasmo"
import { observerMBbank } from "./content/observerMBbank";
import { observerVietcombank } from "./content/observerVietcombank";
export const config: PlasmoCSConfig = {
  matches: [
    "*://*.vcbdigibank.vietcombank.com.vn/*",
    "*://*.online.mbbank.com.vn/*"
  ],
  all_frames: true
}

window.addEventListener("load", () => {
  try {
    if (window.location.hostname.includes("mbbank")) {
      observerMBbank()
    } if (window.location.hostname.includes("vietcombank")) {
      observerVietcombank()
    }
  } catch (error) {
    if (error.message.includes("Extension context invalidated")) {
      console.log("Tiện ích mở rộng đã bị vô hiệu hóa. Vui lòng tải lại trang.")
      window.location.reload()
    } else {
      throw error
    }
  }
})
