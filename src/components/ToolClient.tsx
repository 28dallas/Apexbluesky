'use client';

import ToolInterface from './ToolInterface';
import * as t from '@/lib/tools';
import ImageCropperTool from './tools/ImageCropperTool';
import ColorPickerTool from './tools/ColorPickerTool';
import WatermarkTool from './tools/WatermarkTool';

const actionMap: Record<string, any> = {
    "mergePDFs": t.mergePDFs,
    "splitPDF": t.splitPDF,
    "pdfToWord": t.pdfToWord,
    "compressPDF": t.compressPDF,
    "imageCompressor": t.imageCompressor,
    "backgroundRemover": t.backgroundRemover,
    "imageResizer": t.imageResizer,
    "convertJPGtoPNG": t.convertJPGtoPNG,
    "essayGenerator": t.essayGenerator,
    "paraphraseText": t.paraphraseText,
    "grammarChecker": t.grammarChecker,
    "ytTitleGenerator": t.ytTitleGenerator,
    "generateYouTubeTags": t.generateYouTubeTags,
    "thumbnailDownloader": t.thumbnailDownloader,
    "keywordDensity": t.keywordDensity,
    "metaTagGenerator": t.metaTagGenerator,
    "sitemapGenerator": t.sitemapGenerator,
    "formatJSON": t.formatJSON,
    "cssMinifier": t.cssMinifier,
    "htmlBeautifier": t.htmlBeautifier,
    "ageCalculator": t.ageCalculator,
    "loanCalculator": t.loanCalculator,
    "calculateBMI": t.calculateBMI,
    "mp4ToMp3": t.mp4ToMp3,
    "pdfToJpg": t.pdfToJpg,
    "pngToWebP": t.pngToWebP,
    "generateHashtags": t.generateHashtags,
    "bioGenerator": t.bioGenerator,
    "tiktokCaption": t.tiktokCaption,
    "calculateGPA": t.calculateGPA,
    "citationGenerator": t.citationGenerator,
    "studyPlanner": t.studyPlanner,
    "mpesaToPDF": t.mpesaToPDF,
    "logoGenerator": t.logoGenerator,
    "generatePassword": t.generatePassword,
    "generateQRCode": t.generateQRCode,
    "generateUUID": t.generateUUID,
    "wordCount": t.wordCount,
    "colorPicker": t.colorPicker,
    "pngToJpg": t.pngToJpg,
    "cropImage": t.cropImage,
    "addWatermark": t.addWatermark,
    "base64EncodeDecode": t.base64EncodeDecode,
    "urlEncodeDecode": t.urlEncodeDecode
};

import { useState } from 'react';
import LimitModal from './LimitModal';

export default function ToolClient({ tool, id }: { tool: any, id: string }) {
    const action = actionMap[tool.action];
    const [limitReason, setLimitReason] = useState<string | null>(null);

    if (id === 'image-cropper') return <ImageCropperTool tool={tool} id={id} />;
    if (id === 'color-picker') return <ColorPickerTool tool={tool} id={id} />;
    if (id === 'watermark-maker') return <WatermarkTool tool={tool} id={id} />;

    const fileActions = new Set([
        'mergePDFs',
        'splitPDF',
        'pdfToWord',
        'compressPDF',
        'pdfToJpg',
        'imageCompressor',
        'backgroundRemover',
        'imageResizer',
        'convertJPGtoPNG',
        'pngToWebP',
        'pngToJpg',
        'mp4ToMp3',
    ]);

    const inputType = tool.action === 'mergePDFs'
        ? 'files'
        : fileActions.has(tool.action)
            ? 'file'
            : 'text';

    const accept = (() => {
        if (inputType === 'text') return '*/*';
        switch (tool.action) {
            case 'mergePDFs':
            case 'splitPDF':
            case 'pdfToWord':
            case 'compressPDF':
            case 'pdfToJpg':
                return '.pdf,application/pdf';
            case 'mp4ToMp3':
                return 'video/mp4,video/*';
            case 'convertJPGtoPNG':
                return 'image/jpeg,image/jpg';
            case 'pngToWebP':
            case 'pngToJpg':
                return 'image/png';
            case 'backgroundRemover':
            case 'imageCompressor':
            case 'imageResizer':
                return 'image/*';
            default:
                return '*/*';
        }
    })();

    return (
        <>
            <ToolInterface
                {...tool}
                id={id}
                onAction={action}
                inputType={inputType}
                accept={accept}
                onLimitReached={setLimitReason}
            />
            <LimitModal
                isOpen={!!limitReason}
                onClose={() => setLimitReason(null)}
                reason={limitReason || ''}
            />
        </>
    );
}
