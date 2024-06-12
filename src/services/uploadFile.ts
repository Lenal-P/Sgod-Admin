import type { AxiosError, AxiosResponse } from "axios";
import AxiosInstance from "src/configs/axios";
import adminEndpoint from "src/configs/endpoints/admin";

export interface UploadResponse {
  url?: string;
}

export const uploadSingleFile = async (formData: FormData): Promise<UploadResponse> => {
  try {
    const response: AxiosResponse<{ response: { fileUrl: string } }> = await AxiosInstance.post(
      `${adminEndpoint.uploadFileEndpoint}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return { url: response.data.response.fileUrl }

  } catch (error) {
    const err = error as AxiosError<any>;
    throw new Error(err.response?.data.message || 'Unknown error occurred');
  }
}

