import { toast } from "sonner";

type UseUpdateStageProps = {
    baseUrl: string;
    line: string;
    selectedQrCode?: string | null;
    selectedRequestId?: number | null;
};

export const useUpdateStage = ({
                                   baseUrl,
                                   line,
                                   selectedQrCode,
                                   selectedRequestId,
                               }: UseUpdateStageProps) => {
    const updateStage = async (stage: string) => {
        if (!selectedQrCode || !selectedRequestId) {
            toast.error("Please scan the QR code first!");
            return;
        }

        try {
            const res = await fetch(`${baseUrl}/kiosk/sewing/stage?line=${line}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    request_id: selectedRequestId,
                    qr_code: selectedQrCode,
                    stage,
                }),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.errors);

            toast.success("Stage updated!");
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message);
        }
    };

    return { updateStage };
};
