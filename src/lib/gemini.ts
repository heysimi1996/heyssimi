import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, NumerologyData } from "../types";
import { calculateCungPhi } from "./numerology";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function interpretCompatibility(p1: UserInput, d1: NumerologyData, p2: UserInput, d2: NumerologyData) {
  const prompt = `
    Bạn là một "Cố vấn quan hệ AI", chuyên gia về Thần số học, Ngũ Hành, Tử Vi và Cung Phi Bát Trạch.
    Hãy làm một bản phân tích SIÊU CHI TIẾT (ít nhất 800 chữ) về mức độ tương hợp giữa:
    
    NGƯỜI 1: ${p1.fullName}, Giới tính: ${p1.gender}, Sinh: ${p1.birthDate}, Số chủ đạo: ${d1.lifePath}, Mệnh: ${d1.elementData.element}, Cung Phi: ${calculateCungPhi(p1.birthDate, p1.gender)}
    NGƯỜI 2: ${p2.fullName}, Giới tính: ${p2.gender}, Sinh: ${p2.birthDate}, Số chủ đạo: ${d2.lifePath}, Mệnh: ${d2.elementData.element}, Cung Phi: ${calculateCungPhi(p2.birthDate, p2.gender)}

    YÊU CẦU NỘI DUNG & THUẬT TOÁN:
    - Nếu có người thuộc giới tính LGBT+, hãy phân tích sự đồng điệu tâm hồn, cách vượt qua rào cản xã hội và sự giao thoa năng lượng phi giới tính. Tránh các khuôn mẫu 'vợ/chồng' truyền thống, thay bằng 'bạn đời', 'tri kỷ'.
    - Luận giải dựa trên sự kết hợp Mệnh (vd: Kim sinh Thủy), Thiên Can (vd: Giáp - Kỷ hợp), Địa Chi (vd: Dần - Thân xung), Cung Phi (vd: Sinh Khí, Tuyệt Mệnh).
    - Kết hợp Thần số học: Đối chiếu sự tương hợp giữa hai con số chủ đạo (vd: số 1 độc lập gặp số 2 thấu cảm).

    CẤU TRÚC PHẢN HỒI:
    1. Bảng so sánh thông số: So sánh Mệnh, Thiên Can, Địa Chi, Cung Phi, Số chủ đạo.
    2. Phân tích Tương Hợp: Luận giải sâu về những điểm chung và sự bổ trợ năng lượng.
    3. Phân tích Xung Khắc: Chỉ rõ các "tử huyệt" và rủi ro trong mối quan hệ.
    4. Giải pháp & Cải vận: Lời khuyên cụ thể (màu sắc, hướng nhà, vật phẩm, cách hành xử) để hóa giải xung khắc.
    
    VĂN PHONG: Chuyên sâu, thuyết phục, thấu cảm, mang tính chữa lành và cố vấn cao.
    
    TRẢ VỀ JSON:
    {
      "score": number, // Điểm tương hợp từ 0-100
      "comparisonTable": "...", // Dạng markdown hoặc văn bản chi tiết
      "compatibilityAnalysis": "...", 
      "conflicts": "...",
      "solutions": "..."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            comparisonTable: { type: Type.STRING },
            compatibilityAnalysis: { type: Type.STRING },
            conflicts: { type: Type.STRING },
            solutions: { type: Type.STRING }
          },
          required: ["score", "comparisonTable", "compatibilityAnalysis", "conflicts", "solutions"]
        }
      }
    });

    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Compatibility AI Error:", error);
    return {
      score: 75,
      comparisonTable: "Dữ liệu đang được đồng bộ...",
      compatibilityAnalysis: "Cặp đôi có sự tương hợp khá tốt về mặt lý tưởng sống.",
      conflicts: "Cần chú ý sự nôn nóng trong giao tiếp.",
      solutions: "Hãy cùng nhau thiền định và sử dụng tông màu xanh lá."
    };
  }
}

export async function interpretNumerology(input: UserInput, data: NumerologyData) {
  const prompt = `
    Bạn là một chuyên gia Thần số học AI (Hệ Pythagoras) và Nhân tướng học, đồng thời thông thạo Kinh Dịch và Ngũ Hành.
    Hãy thực hiện một bản phân tích SIÊU CHI TIẾT và CHUYÊN SÂU cho người dùng sau:
    
    THÔNG TIN CƠ BẢN:
    - Họ tên: ${input.fullName}
    - Ngày sinh: ${input.birthDate}
    - Giới tính: ${input.gender}
    
    DỮ LIỆU THẦN SỐ HỌC:
    - Con số chủ đạo (Life Path): ${data.lifePath}
    - Chỉ số linh hồn: ${data.soulUrge}
    - Chỉ số sứ mệnh: ${data.destiny}
    - Năm cá nhân: ${data.personalYear}
    - Các đỉnh cao: ${data.pyramids.join(', ')}
    - Mũi tên sức mạnh/trống: ${data.arrows.map(a => `${a.name} (${a.path})`).join(', ')}
    
    DỮ LIỆU NGŨ HÀNH (BẢN MỆNH):
    - Mệnh: ${data.elementData.element}
    - Nạp Âm: ${data.elementData.napAm}
    
    NHÂN TƯỚNG HỌC:
    - Đặc điểm khuôn mặt: ${JSON.stringify(input.facialFeatures || {})}

    YÊU CẦU LUẬN GIẢI (Nội dung phải cực kỳ chi tiết, tối thiểu 1000 chữ):
    1. Tổng quan Vận mệnh: Luận giải sự kết hợp giữa Con số chủ đạo và Mệnh. 
       - Nếu giới tính là LGBT+: Phân tích sự giao thoa giữa Năng lượng Nam tính (Số lẻ) và Năng lượng Nữ tính (Số chẵn) bên trong họ. Dùng ngôn từ bao hàm, tôn trọng bản sắc. Nhấn mạnh khát vọng tự do và sức mạnh từ sự khác biệt.
       - Với Nam/Nữ: Phân tích theo các đặc tính truyền thống nhưng hiện đại hóa (sự vững chãi, thấu cảm).

    2. Tầng Năng lượng Nội tại: Chỉ số linh hồn và sứ mệnh. Luận giải sâu về khát khao thầm kín.
    3. Cải Vận Phong Thủy & Hóa Giải: 
       - Màu sắc, con số, hướng tốt.
       - MỤC QUAN TRỌNG "Giải pháp Hóa giải Xung Khắc": Dựa trên ngũ hành và con số, đưa ra các gợi ý cụ thể về vật phẩm phong thủy, câu thần chú (mantra) hoặc bài tập thiền định cụ thể để chuyển hóa năng lượng tiêu cực.

    4. Nhân tướng học & Vận trình: Luận giải hậu vận dựa trên Face Analysis và các đỉnh cao đời người.

    CẤU TRÚC MỖI MỤC:
    - Một đoạn tóm tắt ngắn.
    - Phân tích CHUYÊN SÂU (nhiều gạch đầu dòng, mỗi dòng là một ý chi tiết).
    - Lời khuyên từ AI: 1 hành động cụ thể "cần làm ngay hôm nay".

    TRẢ VỀ JSON:
    {
      "overview": "...", // Bao gồm cả phần Bản Mệnh Ngũ Hành mới
      "innerEnergy": "...", 
      "futureForecast": "...",
      "faceAnalysis": "...",
      "elementAnalysis": "...", // Mục mới chi tiết về Ngũ Hành
      "fengShui": {
        "luckyColors": ["..."],
        "luckyNumbers": [...],
        "advice": "..."
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overview: { type: Type.STRING },
            innerEnergy: { type: Type.STRING },
            futureForecast: { type: Type.STRING },
            faceAnalysis: { type: Type.STRING },
            elementAnalysis: { type: Type.STRING },
            fengShui: {
              type: Type.OBJECT,
              properties: {
                luckyColors: { type: Type.ARRAY, items: { type: Type.STRING } },
                luckyNumbers: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                advice: { type: Type.STRING }
              },
              required: ["luckyColors", "luckyNumbers", "advice"]
            }
          },
          required: ["overview", "innerEnergy", "futureForecast", "faceAnalysis", "elementAnalysis", "fengShui"]
        }
      }
    });

    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Interpretation Error:", error);
    return {
      overview: "Hệ thống AI đang quá tải khi xử lý dữ liệu chuyên sâu. Tóm lược: Con số " + data.lifePath + " kết hợp mệnh " + data.elementData.element + " tạo nên một bản thể kiên cường.",
      innerEnergy: "Kỹ năng: Giao tiếp, lãnh đạo, sáng tạo. Tử huyệt: Sự nôn nóng. Lời khuyên: Hãy thiền định 10 phút hôm nay.",
      futureForecast: "Năm cá nhân " + data.personalYear + " mang lại nhiều cơ hội bứt phá.",
      faceAnalysis: "Diện mạo của bạn toát lên vẻ thông tuệ.",
      elementAnalysis: "Mệnh " + data.elementData.element + " của bạn tương hỗ mạnh mẽ cho con số chủ đạo.",
      fengShui: {
        luckyColors: data.elementData.luckyColors,
        luckyNumbers: [data.lifePath, ...data.elementData.luckyNumbers],
        advice: "Hãy sử dụng màu " + data.elementData.luckyColors[0] + " để tăng sinh khí."
      }
    };
  }
}
