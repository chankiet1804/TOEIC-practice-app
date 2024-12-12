import { VocabTopic } from '../data/Vocab';
import SQLite from 'expo-sqlite';

export const vocabTopics: VocabTopic[] = [
    {
        id: 'contract',
        name: 'Contract',
        description: 'Vocabulary related to contracts and agreements',
        words: [
          {
            id: 'contract_1',
            word: "Contract",
            partOfSpeech: "noun",
            vietnamese: "Hợp đồng",
          },
          {
            id: 'contract_2',
            word: "Agreement",
            partOfSpeech: "noun",
            vietnamese: "Thỏa thuận",
          },
          {
            id: 'contract_3',
            word: "Term",
            partOfSpeech: "noun",
            vietnamese: "Điều khoản",
          },
          {
            id: 'contract_4',
            word: "Sign",
            partOfSpeech: "verb",
            vietnamese: "Ký",
          },
          {
            id: 'contract_5',
            word: "Clause",
            partOfSpeech: "noun",
            vietnamese: "Điều khoản",
          },
          {
            id: 'contract_6',
            word: "Condition",
            partOfSpeech: "noun",
            vietnamese: "Điều kiện",
          },
          {
            id: 'contract_7',
            word: "Party",
            partOfSpeech: "noun",
            vietnamese: "Bên (trong hợp đồng)",
          },
          {
            id: 'contract_8',
            word: "Cancel",
            partOfSpeech: "verb",
            vietnamese: "Hủy bỏ",
          },
          {
            id: 'contract_9',
            word: "Pay",
            partOfSpeech: "verb",
            vietnamese: "Thanh toán",
          },
          {
            id: 'contract_10',
            word: "Renew",
            partOfSpeech: "verb",
            vietnamese: "Gia hạn",
          },
          {
            id: 'contract_11',
            word: "Offer",
            partOfSpeech: "noun",
            vietnamese: "Lời đề nghị",
          },
          {
            id: 'contract_12',
            word: "Binding",
            partOfSpeech: "adjective",
            vietnamese: "Ràng buộc",
          },
          {
            id: 'contract_13',
            word: "Legal",
            partOfSpeech: "adjective",
            vietnamese: "Hợp pháp",
          },
          {
            id: 'contract_14',
            word: "Break",
            partOfSpeech: "verb",
            vietnamese: "Vi phạm, phá vỡ hợp đồng",
          },
          {
            id: 'contract_15',
            word: "Change",
            partOfSpeech: "verb",
            vietnamese: "Thay đổi",
          },
          {
            id: 'contract_16',
            word: "Deadline",
            partOfSpeech: "noun",
            vietnamese: "Hạn chót",
          },
          {
            id: 'contract_17',
            word: "Terminate",
            partOfSpeech: "verb",
            vietnamese: "Chấm dứt hợp đồng",
          },
          {
            id: 'contract_18',
            word: "Payment",
            partOfSpeech: "noun",
            vietnamese: "Thanh toán",
          },
          {
            id: 'contract_19',
            word: "Dispute",
            partOfSpeech: "noun",
            vietnamese: "Tranh chấp",
          },
          {
            id: 'contract_20',
            word: "Witness",
            partOfSpeech: "noun",
            vietnamese: "Người chứng kiến",
          }
        ]
      },
      {
        id: 'office',
        name: 'Office',
        description: 'Vocabulary related to office environments',
        words: [
          {
            id: 'office_1',
            word: "Office",
            partOfSpeech: "noun",
            vietnamese: "Văn phòng",
          },
          {
            id: 'office_2',
            word: "Desk",
            partOfSpeech: "noun",
            vietnamese: "Bàn làm việc",
          },
          {
            id: 'office_3',
            word: "Chair",
            partOfSpeech: "noun",
            vietnamese: "Ghế",
          },
          {
            id: 'office_4',
            word: "Computer",
            partOfSpeech: "noun",
            vietnamese: "Máy tính",
          },
          {
            id: 'office_5',
            word: "Email",
            partOfSpeech: "noun",
            vietnamese: "Thư điện tử",
          },
          {
            id: 'office_6',
            word: "File",
            partOfSpeech: "noun",
            vietnamese: "Hồ sơ, tài liệu",
          },
          {
            id: 'office_7',
            word: "Meeting",
            partOfSpeech: "noun",
            vietnamese: "Cuộc họp",
          },
          {
            id: 'office_8',
            word: "Document",
            partOfSpeech: "noun",
            vietnamese: "Tài liệu",
          },
          {
            id: 'office_9',
            word: "Phone",
            partOfSpeech: "noun",
            vietnamese: "Điện thoại",
          },
          {
            id: 'office_10',
            word: "Call",
            partOfSpeech: "verb",
            vietnamese: "Gọi",
          },
          {
            id: 'office_11',
            word: "Schedule",
            partOfSpeech: "verb",
            vietnamese: "Lên lịch, sắp xếp",
          },
          {
            id: 'office_12',
            word: "Copy",
            partOfSpeech: "noun",
            vietnamese: "Bản sao",
          },
          {
            id: 'office_13',
            word: "Printer",
            partOfSpeech: "noun",
            vietnamese: "Máy in",
          },
          {
            id: 'office_14',
            word: "Report",
            partOfSpeech: "noun",
            vietnamese: "Báo cáo",
          },
          {
            id: 'office_15',
            word: "Folder",
            partOfSpeech: "noun",
            vietnamese: "Túi đựng tài liệu",
          },
          {
            id: 'office_16',
            word: "Team",
            partOfSpeech: "noun",
            vietnamese: "Đội nhóm, nhóm",
          },
          {
            id: 'office_17',
            word: "Appointment",
            partOfSpeech: "noun",
            vietnamese: "Cuộc hẹn",
          },
          {
            id: 'office_18',
            word: "Assistant",
            partOfSpeech: "noun",
            vietnamese: "Trợ lý",
          },
          {
            id: 'office_19',
            word: "Task",
            partOfSpeech: "noun",
            vietnamese: "Nhiệm vụ",
          },
          {
            id: 'office_20',
            word: "Meeting",
            partOfSpeech: "noun",
            vietnamese: "Cuộc họp",
          }
        ]
      },
      {
        id: 'marketing',
        name: 'Marketing',
        description: 'Vocabulary related to marketing and sales',
        words: [
          {
            id: 'marketing_1',
            word: "Market",
            partOfSpeech: "noun",
            vietnamese: "Thị trường",
          },
          {
            id: 'marketing_2',
            word: "Product",
            partOfSpeech: "noun",
            vietnamese: "Sản phẩm",
          },
          {
            id: 'marketing_3',
            word: "Sell",
            partOfSpeech: "verb",
            vietnamese: "Bán",
          },
          {
            id: 'marketing_4',
            word: "Advertise",
            partOfSpeech: "verb",
            vietnamese: "Quảng cáo",
          },
          {
            id: 'marketing_5',
            word: "Customer",
            partOfSpeech: "noun",
            vietnamese: "Khách hàng",
          },
          {
            id: 'marketing_6',
            word: "Brand",
            partOfSpeech: "noun",
            vietnamese: "Thương hiệu",
          },
          {
            id: 'marketing_7',
            word: "Strategy",
            partOfSpeech: "noun",
            vietnamese: "Chiến lược",
          },
          {
            id: 'marketing_8',
            word: "Campaign",
            partOfSpeech: "noun",
            vietnamese: "Chiến dịch",
          },
          {
            id: 'marketing_9',
            word: "Price",
            partOfSpeech: "noun",
            vietnamese: "Giá",
          },
          {
            id: 'marketing_10',
            word: "Target",
            partOfSpeech: "noun",
            vietnamese: "Mục tiêu",
          },
          {
            id: 'marketing_11',
            word: "Promotion",
            partOfSpeech: "noun",
            vietnamese: "Khuyến mãi",
          },
          {
            id: 'marketing_12',
            word: "Reach",
            partOfSpeech: "verb",
            vietnamese: "Tiếp cận",
          },
          {
            id: 'marketing_13',
            word: "Sales",
            partOfSpeech: "noun",
            vietnamese: "Doanh thu",
          },
          {
            id: 'marketing_14',
            word: "Launch",
            partOfSpeech: "verb",
            vietnamese: "Ra mắt",
          },
          {
            id: 'marketing_15',
            word: "Discount",
            partOfSpeech: "noun",
            vietnamese: "Giảm giá",
          },
          {
            id: 'marketing_16',
            word: "Research",
            partOfSpeech: "noun",
            vietnamese: "Nghiên cứu",
          },
          {
            id: 'marketing_17',
            word: "Competitor",
            partOfSpeech: "noun",
            vietnamese: "Đối thủ cạnh tranh",
          },
          {
            id: 'marketing_18',
            word: "Audience",
            partOfSpeech: "noun",
            vietnamese: "Khán giả, đối tượng khách hàng",
          },
          {
            id: 'marketing_19',
            word: "Media",
            partOfSpeech: "noun",
            vietnamese: "Phương tiện truyền thông",
          },
          {
            id: 'marketing_20',
            word: "Influence",
            partOfSpeech: "noun",
            vietnamese: "Ảnh hưởng",
          }
        ]
      },
      {
        id: 'computer',
        name: 'Computer',
        description: 'Vocabulary related to computers and technology',
        words: [
          {
            id: 'computer_1',
            word: "Computer",
            partOfSpeech: "noun",
            vietnamese: "Máy tính",
          },
          {
            id: 'computer_2',
            word: "Screen",
            partOfSpeech: "noun",
            vietnamese: "Màn hình",
          },
          {
            id: 'computer_3',
            word: "Keyboard",
            partOfSpeech: "noun",
            vietnamese: "Bàn phím",
          },
          {
            id: 'computer_4',
            word: "Mouse",
            partOfSpeech: "noun",
            vietnamese: "Chuột",
          },
          {
            id: 'computer_5',
            word: "Software",
            partOfSpeech: "noun",
            vietnamese: "Phần mềm",
          },
          {
            id: 'computer_6',
            word: "Hardware",
            partOfSpeech: "noun",
            vietnamese: "Phần cứng",
          },
          {
            id: 'computer_7',
            word: "File",
            partOfSpeech: "noun",
            vietnamese: "Tệp",
          },
          {
            id: 'computer_8',
            word: "Program",
            partOfSpeech: "noun",
            vietnamese: "Chương trình",
          },
          {
            id: 'computer_9',
            word: "Network",
            partOfSpeech: "noun",
            vietnamese: "Mạng",
          },
          {
            id: 'computer_10',
            word: "Website",
            partOfSpeech: "noun",
            vietnamese: "Trang web",
          },
          {
            id: 'computer_11',
            word: "Download",
            partOfSpeech: "verb",
            vietnamese: "Tải xuống",
          },
          {
            id: 'computer_12',
            word: "Upload",
            partOfSpeech: "verb",
            vietnamese: "Tải lên",
          },
          {
            id: 'computer_13',
            word: "Browser",
            partOfSpeech: "noun",
            vietnamese: "Trình duyệt",
          },
          {
            id: 'computer_14',
            word: "Application",
            partOfSpeech: "noun",
            vietnamese: "Ứng dụng",
          },
          {
            id: 'computer_15',
            word: "Virus",
            partOfSpeech: "noun",
            vietnamese: "Vi-rút",
          },
          {
            id: 'computer_16',
            word: "Search",
            partOfSpeech: "verb",
            vietnamese: "Tìm kiếm",
          },
          {
            id: 'computer_17',
            word: "Update",
            partOfSpeech: "verb",
            vietnamese: "Cập nhật",
          },
          {
            id: 'computer_18',
            word: "System",
            partOfSpeech: "noun",
            vietnamese: "Hệ thống",
          },
          {
            id: 'computer_19',
            word: "Security",
            partOfSpeech: "noun",
            vietnamese: "Bảo mật",
          },
          {
            id: 'computer_20',
            word: "Password",
            partOfSpeech: "noun",
            vietnamese: "Mật khẩu",
          }
        ]
      },
      {
        id: 'salaries-and-benefits',
        name: 'Salaries and Benefits',
        description: 'Vocabulary related to salary and employee benefits',
        words: [
            {
                id: 'salary_1',
                word: "Salary",
                partOfSpeech: "noun",
                vietnamese: "Lương",
            },
            {
                id: 'salary_2',
                word: "Wage",
                partOfSpeech: "noun",
                vietnamese: "Tiền công",
            },
            {
                id: 'salary_3',
                word: "Bonus",
                partOfSpeech: "noun",
                vietnamese: "Thưởng",
            },
            {
                id: 'salary_4',
                word: "Commission",
                partOfSpeech: "noun",
                vietnamese: "Hoa hồng",
            },
            {
                id: 'salary_5',
                word: "Raise",
                partOfSpeech: "noun",
                vietnamese: "Tăng lương",
            },
            {
                id: 'salary_6',
                word: "Overtime",
                partOfSpeech: "noun",
                vietnamese: "Làm thêm giờ",
            },
            {
                id: 'salary_7',
                word: "Pension",
                partOfSpeech: "noun",
                vietnamese: "Lương hưu",
            },
            {
                id: 'salary_8',
                word: "Health",
                partOfSpeech: "noun",
                vietnamese: "Sức khỏe",
            },
            {
                id: 'salary_9',
                word: "Insurance",
                partOfSpeech: "noun",
                vietnamese: "Bảo hiểm",
            },
            {
                id: 'salary_10',
                word: "Allowance",
                partOfSpeech: "noun",
                vietnamese: "Tiền trợ cấp",
            },
            {
                id: 'salary_11',
                word: "Benefit",
                partOfSpeech: "noun",
                vietnamese: "Phúc lợi",
            },
            {
                id: 'salary_12',
                word: "Compensation",
                partOfSpeech: "noun",
                vietnamese: "Tiền bồi thường",
            },
            {
                id: 'salary_13',
                word: "Contract",
                partOfSpeech: "noun",
                vietnamese: "Hợp đồng",
            },
            {
                id: 'salary_14',
                word: "Salary scale",
                partOfSpeech: "noun",
                vietnamese: "Thang lương",
            },
            {
                id: 'salary_15',
                word: "Deduction",
                partOfSpeech: "noun",
                vietnamese: "Khấu trừ",
            },
            {
                id: 'salary_16',
                word: "Tax",
                partOfSpeech: "noun",
                vietnamese: "Thuế",
            },
            {
                id: 'salary_17',
                word: "Paid leave",
                partOfSpeech: "noun",
                vietnamese: "Nghỉ phép có lương",
            },
            {
                id: 'salary_18',
                word: "Vacation",
                partOfSpeech: "noun",
                vietnamese: "Nghỉ phép",
            },
            {
                id: 'salary_19',
                word: "Employee",
                partOfSpeech: "noun",
                vietnamese: "Nhân viên",
            }
        ]
      }
]

export const getVocabByTopic = (topicId: string): VocabTopic | undefined => {
  return vocabTopics.find(topic => topic.id === topicId);
};

export const getAllTopics = (): VocabTopic[] => {
  return vocabTopics;
};
