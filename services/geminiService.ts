import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export type EnhancementMode = 'general' | 'face' | 'landscape';

const prompts: Record<EnhancementMode, string> = {
  general: 'Act as a professional photo editor. Your task is to enhance the provided image with the highest possible quality. Follow these steps: 1. **Clarity and Sharpness:** Significantly increase the image clarity and sharpness. Bring out fine details without creating artificial halos or artifacts. 2. **Color Correction:** Adjust the color balance to be natural and vibrant. Enhance saturation and contrast, making the colors pop while maintaining realism. Correct any color casts. 3. **Lighting and Exposure:** Optimize the lighting. Adjust exposure, highlights, and shadows to create a well-balanced image with good dynamic range. Avoid clipping highlights or crushing blacks. 4. **Noise and Blur Reduction:** Intelligently remove any noise, grain, or blurriness. The final image should be clean and smooth. 5. **High-Resolution Effect:** Upscale the image quality to simulate a high-resolution photograph. The final result should be a dramatically improved, professional-grade photograph. Do not add, remove, or change any objects in the image.',
  face: 'Act as an expert portrait retoucher. Your goal is to enhance the human face in this image to a professional studio quality. Follow these steps meticulously: 1. **Face Reconstruction:** Focus on the face. Reconstruct fine details in the eyes, hair, and skin texture. Sharpen eyelashes and eyebrows. 2. **Skin Enhancement:** Create natural, smooth skin texture. Subtly remove blemishes, acne, and uneven skin tones while preserving natural pores. Do not make it look plastic or artificial. 3. **Eye Enhancement:** Make the eyes clearer and brighter. Enhance the color of the iris and add a subtle glint to make them pop. 4. **Lighting:** Adjust the lighting on the face to be more flattering. Add soft highlights and balanced shadows to create depth and dimension. 5. **Overall Polish:** Perform a final pass for color correction and noise reduction for the entire image, ensuring the subject stands out. The result should be a stunning, high-definition portrait.',
  landscape: 'Act as a professional landscape photographer editing a prize-winning photo. Your goal is to make this scene breathtaking. Follow these steps: 1. **Dynamic Range:** Dramatically enhance the dynamic range. Recover details from the highlights (like clouds in the sky) and shadows. 2. **Color Vibrancy:** Boost the colors to be rich and vibrant, but realistic. Enhance the blues of the sky and water, the greens of foliage, and the warm tones of sunsets/sunrises. 3. **Atmospheric Depth:** Increase the sense of depth and scale. Add a slight haze or clarity effect to distinguish between foreground, midground, and background elements. 4. **Sharpness and Detail:** Sharpen key elements like mountains, trees, and architectural details to make them crisp and clear. 5. **Sky Enhancement:** Pay special attention to the sky. Make clouds more defined and dramatic. If it\'s a clear sky, make the color gradient smooth and beautiful. The final image should look immersive and awe-inspiring.'
};

export const enhanceImage = async (base64ImageData: string, mimeType: string, mode: EnhancementMode): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompts[mode],
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imagePart && imagePart.inlineData) {
      return imagePart.inlineData.data;
    } else {
      const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
      if (textPart && textPart.text) {
        throw new Error(`API returned text instead of an image: ${textPart.text}`);
      }
      throw new Error('Image enhancement failed: No image data received from the API.');
    }
  } catch (error) {
    console.error('Error enhancing image with Gemini API:', error);
    if (error instanceof Error && error.message.includes('API returned text')) {
       throw error;
    }
    throw new Error('Failed to communicate with the AI enhancement service. Please try again later.');
  }
};