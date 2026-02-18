import { parse, isValid } from "date-fns";
// import { GenerationUtils } from "@siddheshwar.anajekar/common-base";
import { CommonUtils, GenerationUtils } from '@anddone/coretestautomation/dist';

export class CoverageValidator {

    static compareCoverageData(apiData: any, uiData: any): string[] {

        const mismatches: string[] = [];

        // ----- Basic Safety Checks -----
        if (!apiData?.value?.records) {
            return ["Invalid API response format"];
        }

        if (!uiData?.value?.records) {
            return ["Invalid UI response format"];
        }

        const apiRecords = apiData.value.records;
        const uiRecords = uiData.value.records;
        if (apiRecords.length !== uiRecords.length) {
            return [
                `Record count mismatch: API has ${apiRecords.length} records, UI has ${uiRecords.length} records`
            ];
        }


        const apiMap: any = {};
        apiRecords.forEach((rec: any) => {
            apiMap[rec.adUniqueId] = rec;
        });

        const uiMap: any = {};
        uiRecords.forEach((rec: any) => {
            uiMap[rec.adUniqueId] = rec;
        });

        // ----- MAIN COMPARISON -----
        for (const adId in uiMap) {

            const uiItem = uiMap[adId];
            const apiItem = apiMap[adId];

            if (!apiItem) {
                mismatches.push(`UI item ${adId} not found in API response`);
                continue;
            }

            // ----- Name -----
            if (uiItem.name !== apiItem.name) {
                mismatches.push(`Name mismatch for ${adId}`);
            }

            // ----- Line of Business -----
            const apiLOB = apiItem.pfCoverage.isCommercial
                ? "Commercial"
                : "Personal";

            if (uiItem.lineOfBusiness !== apiLOB) {
                mismatches.push(`Line of Business mismatch for ${adId}`);
            }

            // ----- Mapping Status -----
            if (uiItem.isMapped !== apiItem.pfCoverageEligibility.isMapped) {
                mismatches.push(`Mapping status mismatch for ${adId}`);
            }

            // ----- Status -----
            if (uiItem.status !== apiItem.status) {
                mismatches.push(`Status mismatch for ${adId}`);
            }

            // ----- Portal Status -----
            if (uiItem.portalStatus !== apiItem.portalStatus) {
                mismatches.push(`Portal Status mismatch for ${adId}`);
            }

            // ----- Lock Status -----
            if (uiItem.isLocked !== apiItem.isLocked) {
                mismatches.push(`Lock status mismatch for ${adId}`);
            }

            // ================= DATE COMPARISON USING YOUR FUNCTION =================

            try {
                // ---- Parse UI Date ----
                const uiDateObj = new Date(uiItem.createdOn);

                // ---- Parse API Date (format: MM-dd-yyyy HH:mm:ss) ----
                const apiDateObj = parse(
                    apiItem.createdOn,
                    "MM-dd-yyyy HH:mm:ss",
                    new Date()
                );

                // ---- Normalize both using YOUR function ----
                const normalizedUiDate = GenerationUtils.normalizeToDateOnly(uiDateObj);
                const normalizedApiDate = GenerationUtils.normalizeToDateOnly(apiDateObj);

                // ---- Final Date Comparison ----
                if (
                    !normalizedUiDate ||
                    !normalizedApiDate ||
                    normalizedUiDate.getTime() !== normalizedApiDate.getTime()
                ) {
                    mismatches.push(`Created On date mismatch for ${adId}`);
                }

            } catch (error) {
                mismatches.push(`Date parsing error for ${adId}`);
            }
        }

        // ----- Check if API has extra items not present in UI -----
        for (const adId in apiMap) {
            if (!uiMap[adId]) {
                mismatches.push(`API item ${adId} not found in UI response`);
            }
        }

        return mismatches;
    }

    static comparePrograms(apiResponse: any, uiResponse: any): string[] {

        const mismatches: string[] = [];

        // ----- Validate structure -----
        if (
            !apiResponse?.value?.records ||
            !uiResponse?.value?.records ||
            !Array.isArray(apiResponse.value.records) ||
            !Array.isArray(uiResponse.value.records)
        ) {
            return ["Invalid API or UI response structure"];
        }

        const apiRecords = apiResponse.value.records;
        const uiRecords = uiResponse.value.records;

        // Convert to maps for easy lookup
        const apiMap = new Map<string, any>();
        const uiMap = new Map<string, any>();

        apiRecords.forEach((r: any) => apiMap.set(r.adUniqueId, r));
        uiRecords.forEach((r: any) => uiMap.set(r.adUniqueId, r));

        // ----- Compare each UI record with API -----
        for (const [adUniqueId, uiItem] of uiMap.entries()) {

            const apiItem = apiMap.get(adUniqueId);

            if (!apiItem) {
                mismatches.push(`Program ${adUniqueId} present in UI but missing in API`);
                continue;
            }

            // ----- Program Name -----
            if (uiItem.programName !== apiItem.programName) {
                mismatches.push(`Program Name mismatch for ${adUniqueId}`);
            }

            // ----- IPFS Program ID -----
            if (String(uiItem.ipfsProgramId) !== String(apiItem.ipfsProgramId)) {
                mismatches.push(`IPFS Program ID mismatch for ${adUniqueId}`);
            }

            // ----- Line of Business -----
            const apiLOB =
                apiItem.lineOfBusiness === "C"
                    ? "Commercial"
                    : apiItem.lineOfBusiness === "P"
                        ? "Personal"
                        : apiItem.lineOfBusiness;

            if (uiItem.lineOfBusiness !== apiLOB) {
                mismatches.push(`Line of Business mismatch for ${adUniqueId}`);
            }

            // ----- Quote Limit -----
            const apiQuoteLimit = `$${apiItem.quoteLimit.quoteLimitAmount}`;

            if (uiItem.quoteLimit !== apiQuoteLimit) {
                mismatches.push(`Quote Limit mismatch for ${adUniqueId}`);
            }

            // ----- Payment Interval -----
            const apiPaymentInterval =
                apiItem.paymentInterval.paymentIntervalDescription;

            if (uiItem.paymentInterval !== apiPaymentInterval) {
                mismatches.push(`Payment Interval mismatch for ${adUniqueId}`);
            }

            // ----- Risk States -----
            const apiStates = apiItem.riskStates.map(
                (s: any) => s.stateAbbreviation
            );

            const uiStates = uiItem.riskStates;

            if (
                apiStates.length !== uiStates.length ||
                !apiStates.every((s: string) => uiStates.includes(s))
            ) {
                mismatches.push(`Risk States mismatch for ${adUniqueId}`);
            }

            // ----- Underlying Plans -----
            const apiPlans = apiItem.underlyingPlans.map((p: any) => ({
                "Plan Name": p.planName,
                "Down Percent": `${p.downPercent}%`,
                "Installments": String(p.installments),
            }));

            const uiPlans = uiItem.underlyingPlans;

            if (JSON.stringify(apiPlans) !== JSON.stringify(uiPlans)) {
                mismatches.push(`Underlying Plans mismatch for ${adUniqueId}`);
            }
        }

        // ----- Check for extra API records -----
        for (const adUniqueId of apiMap.keys()) {
            if (!uiMap.has(adUniqueId)) {
                mismatches.push(
                    `Program ${adUniqueId} present in API but missing in UI`
                );
            }
        }

        return mismatches;
    }

    static compareBrokers(apiResponse: any, uiResponse: any): string[] {

        const mismatches: string[] = [];

        // ----- Validate Structure -----
        if (!apiResponse?.value?.records || !uiResponse?.value?.records) {
            return ["Invalid API or UI response structure"];
        }

        const apiRecords = apiResponse.value.records;
        const uiRecords = uiResponse.value.records;

        if (apiRecords.length !== uiRecords.length) {
            mismatches.push(
                `Record count mismatch: API has ${apiRecords.length}, UI has ${uiRecords.length}`
            );
        }

        // Convert to map by adUniqueId
        const apiMap = new Map<string, any>();
        const uiMap = new Map<string, any>();

        apiRecords.forEach((r: any) => apiMap.set(r.adUniqueId, r));
        uiRecords.forEach((r: any) => uiMap.set(r.adUniqueId, r));

        // Normalizer for safe string comparison
        const normalize = (val: string) =>
            val?.replace(/[^a-z0-9]/gi, "").toLowerCase();

        // ----- MAIN COMPARISON -----
        for (const [adUniqueId, uiItem] of uiMap.entries()) {

            const apiItem = apiMap.get(adUniqueId);

            if (!apiItem) {
                mismatches.push(`Broker ${adUniqueId} present in UI but missing in API`);
                continue;
            }

            // ----- Name (Column 1 → apiItem.name) -----
            if (normalize(uiItem.name) !== normalize(apiItem.name)) {
                mismatches.push(`Name mismatch for ${adUniqueId}`);
            }

            // ----- IPFS Broker Name (Column 4 → apiItem.pfBroker.brokerName) -----
            if (
                normalize(uiItem.pfBroker?.brokerName) !==
                normalize(apiItem.pfBroker?.brokerName)
            ) {
                mismatches.push(`IPFS Broker Name mismatch for ${adUniqueId}`);
            }

            // ----- Customer Unique ID -----
            if (uiItem.customerUniqueId !== apiItem.customerUniqueId) {
                mismatches.push(`Customer ID mismatch for ${adUniqueId}`);
            }

            // ----- Mapping Status -----
            if (
                uiItem.pfBrokerEligibility?.isMapped !==
                apiItem.pfBrokerEligibility?.isMapped
            ) {
                mismatches.push(`Mapping status mismatch for ${adUniqueId}`);
            }

            // ----- Status -----
            if (uiItem.status !== apiItem.status) {
                mismatches.push(`Status mismatch for ${adUniqueId}`);
            }

            // ----- Portal Status -----
            if (uiItem.portalStatus !== apiItem.portalStatus) {
                mismatches.push(`Portal Status mismatch for ${adUniqueId}`);
            }

            // ================= DATE COMPARISON =================
            try {

                const uiDateObj = new Date(uiItem.createdOn);

                const apiDateObj = parse(
                    apiItem.createdOn,
                    "MM-dd-yyyy HH:mm:ss",
                    new Date()
                );

                const normalizedUiDate =
                    GenerationUtils.normalizeToDateOnly(uiDateObj);

                const normalizedApiDate =
                    GenerationUtils.normalizeToDateOnly(apiDateObj);

                if (
                    !normalizedUiDate ||
                    !normalizedApiDate ||
                    normalizedUiDate.getTime() !== normalizedApiDate.getTime()
                ) {
                    mismatches.push(`Created On date mismatch for ${adUniqueId}`);
                }

            } catch (error) {
                mismatches.push(`Date parsing error for ${adUniqueId}`);
            }
        }

        // ----- Check Extra API Records -----
        for (const adUniqueId of apiMap.keys()) {
            if (!uiMap.has(adUniqueId)) {
                mismatches.push(
                    `Broker ${adUniqueId} present in API but missing in UI`
                );
            }
        }

        return mismatches;
    }


}