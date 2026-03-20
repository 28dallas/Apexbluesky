'use client';

import ToolInterface from './ToolInterface';
import * as t from '@/lib/tools';
import ImageCropperTool from './tools/ImageCropperTool';
import ColorPickerTool from './tools/ColorPickerTool';
import WatermarkTool from './tools/WatermarkTool';
import MpesaStatementTool from './tools/MpesaStatementTool';
import EssayGeneratorTool from './tools/EssayGeneratorTool';
import BackgroundRemoverTool from './tools/BackgroundRemoverTool';
import MergePdfTool from './tools/MergePdfTool';
import { useSyncExternalStore, useEffect } from 'react';
import { getGuestCreditsRemaining, consumeGuestCredits } from '@/lib/guestCredits';
import { recordToolUsage } from '@/lib/usage';
import { CREDIT_COSTS } from '@/config/toolConfig';
import { useAuth } from '@/context/AuthContext';
import type { ToolField } from './ToolInterface';
import type { ToolDefinition } from '@/types/tools';

type ToolAction = (input: unknown) => string | number | Blob | null | Promise<string | number | Blob | null>;

const actionMap = {
    "mergePDFs": t.mergePDFs,
    "splitPDF": t.splitPDF,
    "pdfToWord": t.pdfToWord,
    "compressPDF": t.compressPDF,
    "imageCompressor": t.imageCompressor,
    "imageResizer": t.imageResizer,
    "convertJPGtoPNG": t.convertJPGtoPNG,
    "essayGenerator": t.essayGenerator,
    "paraphraseText": t.paraphraseText,
    "grammarChecker": t.grammarChecker,
    "generateBlogTitles": t.generateBlogTitles,
    "generateBlogPost": t.generateBlogPost,
    "generateProductDesc": t.generateProductDesc,
    "draftEmail": t.draftEmail,
    "generateStory": t.generateStory,
    "generateInstaCaption": t.generateInstaCaption,
    "generateYTDescription": t.generateYTDescription,
    "generateLinkedInPost": t.generateLinkedInPost,
    "generateTweet": t.generateTweet,
    "generateSEOKeywords": t.generateSEOKeywords,
    "generateMetaTagsAI": t.generateMetaTagsAI,
    "generateBlogOutline": t.generateBlogOutline,
    "generateBusinessName": t.generateBusinessName,
    "generateValueProp": t.generateValueProp,
    "generateImagePrompt": t.generateImagePrompt,
    "generateCoverLetter": t.generateCoverLetter,
    "generateResumeSummary": t.generateResumeSummary,
    "reviewCode": t.reviewCode,
    "generateRegex": t.generateRegex,
    "generateFlashcards": t.generateFlashcards,
    "generateSlogan": t.generateSlogan,
    "generateAltText": t.generateAltText,
    "generateSQL": t.generateSQL,
    "generateStudyPlan": t.generateStudyPlan,
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
    "urlEncodeDecode": t.urlEncodeDecode,
    "followersAnalysis": t.followersAnalysis,
    "bulkActions": t.bulkActions,
    "dataExports": t.dataExports
} as unknown as Record<string, ToolAction>;

import { useState } from 'react';
import LimitModal from './LimitModal';
import TikTokPromoModal from './TikTokPromoModal';

const TIKTOK_STORAGE_KEY = 'apexbs_tiktok_dismissed';

function subscribeToTikTokDismissal(onChange: () => void) {
    if (typeof window === 'undefined') {
        return () => undefined;
    }

    const handleStorage = (event: StorageEvent) => {
        if (event.key === TIKTOK_STORAGE_KEY) {
            onChange();
        }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
}

function getTikTokDismissalSnapshot() {
    if (typeof window === 'undefined') {
        return '1';
    }

    return window.localStorage.getItem(TIKTOK_STORAGE_KEY);
}

export default function ToolClient({ tool, id }: { tool: ToolDefinition, id: string }) {
    const { user } = useAuth();
    const action = actionMap[tool.action];
    const [limitReason, setLimitReason] = useState<string | null>(null);
    const [guestCreditsRemaining, setGuestCreditsRemaining] = useState(0);

    useEffect(() => {
        if (!user) {
            setGuestCreditsRemaining(getGuestCreditsRemaining(id));
        }
    }, [user, id]);

    const tikTokDismissed = useSyncExternalStore(
        subscribeToTikTokDismissal,
        getTikTokDismissalSnapshot,
        () => '1'
    );
    const showTikTok = !user && !tikTokDismissed && getGuestCreditsRemaining(id) <= 0;

    const handleTikTokContinue = () => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(TIKTOK_STORAGE_KEY, '1');
            window.dispatchEvent(new StorageEvent('storage', { key: TIKTOK_STORAGE_KEY, newValue: '1' }));
        }
    };

    const handleActionComplete = (creditsSpent: number) => {
        if (!user) {
            consumeGuestCredits(id, creditsSpent);
            setGuestCreditsRemaining(getGuestCreditsRemaining(id));
        }
        recordToolUsage(id);
    };

    const commonProps = {
        guestCreditsRemaining: !user ? guestCreditsRemaining : undefined,
        onActionComplete: handleActionComplete
    };

    if (id === 'image-cropper') return <><TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} /><ImageCropperTool tool={tool} credits={CREDIT_COSTS['imageCropper']} {...commonProps} /></>;
    if (id === 'color-picker') return <><ColorPickerTool tool={tool} id={id} /></>;
    if (id === 'watermark-maker') return <><TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} /><WatermarkTool tool={tool} credits={CREDIT_COSTS['watermarkMaker']} {...commonProps} /></>;
    if (id === 'mpesa-to-pdf') return <><TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} /><MpesaStatementTool tool={tool} credits={CREDIT_COSTS['mpesaToPDF']} disclaimer="This is an unofficial statement. ApexBlueSky Tools is not affiliated with Safaricom M-Pesa. Use generated statements at your own discretion. Not for legal or bank verification use." {...commonProps} /></>;
    if (id === 'essay-generator') return <><TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} /><EssayGeneratorTool tool={tool} credits={CREDIT_COSTS['essayGenerator']} {...commonProps} /></>;
    if (id === 'background-remover') return <><TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} /><BackgroundRemoverTool tool={tool} credits={CREDIT_COSTS[tool.action]} {...commonProps} /></>;
    if (id === 'merge-pdf') return <><TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} /><MergePdfTool tool={tool} credits={CREDIT_COSTS['mergePDFs']} {...commonProps} /></>;

    const fileActions = new Set([
        'mergePDFs',
        'pdfToWord',
        'compressPDF',
        'pdfToJpg',
        'imageCompressor',
        'backgroundRemover',
        'convertJPGtoPNG',
        'pngToWebP',
        'pngToJpg',
        'mp4ToMp3',
    ]);

    const formActions: Record<string, ToolField[]> = {
        'splitPDF': [
            { id: 'file', label: 'Select PDF', type: 'file', accept: '.pdf' },
            { id: 'range', label: 'Page Range (e.g. 1, 3-5)', type: 'text', defaultValue: '1', placeholder: '1, 3-5' }
        ],
        'imageResizer': [
            { id: 'file', label: 'Select Image', type: 'file', accept: 'image/*' },
            { id: 'width', label: 'Width (px)', type: 'number', defaultValue: 800 },
            { id: 'height', label: 'Height (px)', type: 'number', placeholder: 'Optional' }
        ],
        'loanCalculator': [
            { id: 'principal', label: 'Principal Amount', type: 'number', defaultValue: 10000 },
            { id: 'rate', label: 'Interest Rate (%)', type: 'number', defaultValue: 5, step: 0.1 },
            { id: 'time', label: 'Time (Years)', type: 'number', defaultValue: 3 }
        ],
        'calculateBMI': [
            { id: 'weight', label: 'Weight (kg)', type: 'number', defaultValue: 70 },
            { id: 'height', label: 'Height (cm)', type: 'number', defaultValue: 170 }
        ],
        'ageCalculator': [
            { id: 'dob', label: 'Date of Birth', type: 'text', placeholder: 'YYYY-MM-DD' }
        ]
    };

    const aiActions = new Set([
        'essayGenerator', 'paraphraseText', 'grammarChecker', 'generateBlogTitles',
        'generateBlogPost', 'generateProductDesc', 'draftEmail', 'generateStory',
        'generateInstaCaption', 'generateYTDescription', 'generateLinkedInPost',
        'generateTweet', 'generateSEOKeywords', 'generateMetaTagsAI', 'generateBlogOutline',
        'generateBusinessName', 'generateValueProp', 'generateImagePrompt',
        'generateCoverLetter', 'generateResumeSummary', 'reviewCode',
        'generateRegex', 'generateFlashcards', 'generateSlogan', 'generateAltText',
        'generateSQL', 'generateStudyPlan'
    ]);

    const inputType = formActions[tool.action]
        ? 'form'
        : tool.action === 'mergePDFs'
            ? 'files'
            : fileActions.has(tool.action)
                ? 'file'
                : 'text';

    const accept = (() => {
        if (inputType === 'text' || inputType === 'form') return '*/*';
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
            <TikTokPromoModal isOpen={showTikTok} onContinue={handleTikTokContinue} />
            <ToolInterface
                {...tool}
                id={id}
                inputPlaceholder={tool.inputPlaceholder ?? 'Enter your input above to get started.'}
                onAction={action}
                inputType={inputType}
                accept={accept}
                fields={formActions[tool.action]}
                isAI={aiActions.has(tool.action)}
                credits={CREDIT_COSTS[tool.action]}
                disclaimer={tool.action === 'mpesaToPDF' ? "This is an unofficial statement. ApexBlueSky Tools is not affiliated with Safaricom M-Pesa. Use generated statements at your own discretion. Not for legal or bank verification use." : undefined}
                onLimitReached={setLimitReason}
                guestCreditsRemaining={!user ? guestCreditsRemaining : undefined}
                onActionComplete={handleActionComplete}
            />
            <LimitModal
                isOpen={!!limitReason}
                onClose={() => setLimitReason(null)}
                reason={limitReason || ''}
            />
        </>
    );
}
