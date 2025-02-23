import {
  generateUploadButton,
  generateUploadDropzone,
} from '@uploadthing/react';

import type { GradualFileRouter } from '@/app/api/uploadthing/core';

export const UploadButton = generateUploadButton<GradualFileRouter>();
export const UploadDropzone = generateUploadDropzone<GradualFileRouter>();
