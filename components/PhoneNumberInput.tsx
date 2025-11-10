import { Input, InputField } from "@/components/ui/input";
import PHFlag from "@/components/SvgIcons/PHFlag";
import USFlag from "@/components/SvgIcons/USFlag";

import React, { useState } from "react";

const DEFAULT_MAX_LENGTH = 13;

export const PhoneNumberInput = ({ onChangeValue, formatters = [] }: PhoneNumberInputProps) => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [activeFormatter, setActiveFormatter] = useState<PhoneNumberFormatter | null>(null);
    const handleChangeText = (value: string) => {
        if (!value.length) {
            onChangeValue("");
            setPhoneNumber("");
            setActiveFormatter(null);
            return;
        };
        const sanitizedValue = value.replace(/[- )(+a-zA-Z]/g, "");
        onChangeValue(`+${sanitizedValue}`);
        for (const formatter of formatters) {
            if (sanitizedValue.startsWith(formatter.startingDigit)) {
                let formattedNumber = formatter.startingDigitFormat;
                const formatterSections = formatter.formatSections;
                if (!formatterSections.length) break;
                for (const section of formatterSections) {
                    const sectionValue = sanitizedValue.slice(section.startIndex, section.endIndex);
                    if (!sectionValue.length) break;
                    formattedNumber += section.formatter(sectionValue);
                }
                setPhoneNumber(formattedNumber);
                setActiveFormatter(formatter);
                return;
            }
        }
        setPhoneNumber(value);
        setActiveFormatter(null);
    };
    return <Input
        size="lg"
        variant="outline"
        className="w-full rounded-full px-4"
    >
        {activeFormatter && <activeFormatter.flag />}
        <InputField
            placeholder="Enter your phone number"
            value={phoneNumber}
            maxLength={activeFormatter?.maxLength || DEFAULT_MAX_LENGTH}
            keyboardType="phone-pad"
            onChangeText={handleChangeText}
        />
    </Input>
};

export const PHPhoneNumberFormatter: PhoneNumberFormatter = {
    id: "PH",
    startingDigit: "63",
    startingDigitFormat: "+63",
    formatSections: [
        {
            startIndex: 2,
            endIndex: 6,
            formatter: (section: string) => ` ${section}`,
        },
        {
            startIndex: 6,
            endIndex: 9,
            formatter: (section: string) => `-${section}`,
        },
        {
            startIndex: 9,
            endIndex: 12,
            formatter: (section: string) => `-${section}`,
        },
    ],
    // NOTE - including special characters like spaces and dashes
    maxLength: 16,
    flag: PHFlag
};

export const USPhoneNumberFormatter: PhoneNumberFormatter = {
    id: "US",
    startingDigit: "1",
    startingDigitFormat: "+1",
    formatSections: [
        {
            startIndex: 1,
            endIndex: 4,
            formatter: (section: string) => `-${section}`,
        },
        {
            startIndex: 4,
            endIndex: 7,
            formatter: (section: string) => `-${section}`,
        },
        {
            startIndex: 7,
            endIndex: 11,
            formatter: (section: string) => `-${section}`,
        },
    ],
    // NOTE - including special characters like spaces and dashes
    maxLength: 15,
    flag: USFlag
};

type PhoneNumberInputProps = {
    onChangeValue: (value: string) => void;
    formatters?: Array<PhoneNumberFormatter>;
};

export type PhoneNumberFormatter = {
    // The unique identifier of the formatter
    id: string;
    // The starting digit of the phone number
    startingDigit: string;
    // Depicts how the starting digit should be formatted
    startingDigitFormat: string;
    // Depicts the sections of the phone number that should be formatted
    formatSections: Array<{
        // The position of the section
        startIndex: number;
        endIndex: number;
        // The formatter function to be used to format the section
        formatter: (section: string) => string;
    }>;
    // The maximum length of the phone number including special characters like spaces and dashes
    maxLength: number;
    flag: React.FC;
};