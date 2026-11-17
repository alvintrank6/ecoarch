// Button label (Vietnamese text of the section, used as a key for both locales) -> target page id or anchor.
import type { PageId } from '../i18n/routes';
const map: Record<string, PageId | `#${string}`> = {
  'Đặt lịch trao đổi về khu đất': 'book', 'Đặt lịch trao đổi': 'book',
  'Đọc bài về hướng nắng và gió': 'readSunWind', 'Đọc bài về nắng và gió': 'readSunWind', 'Chuẩn bị cho buổi trao đổi': 'prepareCall',
  'Xem chi tiết 3 gói': 'services', 'Xem chi tiết từng gói': 'services', 'So sánh 3 gói': 'services', 'Xem 3 gói dịch vụ': 'services',
  'Xem thêm phương án': 'concepts', 'Xem các phương án khác': 'concepts', 'Xem phương án': 'concepts',
  'Xem Gói 2': 'architectural', 'Xem Gói 3': 'integrated',
  'Xem phạm vi bàn giao': 'scope', 'Xem quy trình': 'process',
  'Xem hỏi đáp': 'faq', 'Xem hỏi đáp về chi phí': 'faq',
  'Đọc chính sách bảo mật': 'privacy', 'Liên hệ': 'contact',
  'Điền biểu mẫu': '#form',
};
export const hrefKey = (viButton: string | null): PageId | `#${string}` | null => (viButton ? map[viButton] ?? null : null);
