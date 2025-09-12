import TranslationContext from "@contexts/TranslationContext";
import { useContext, useMemo } from "react";

interface BylineProps {
    author?: string;
    date?: number | string | Date;
    dateOptions?: Intl.DateTimeFormatOptions;
}

const Byline = (props: BylineProps) => {
    const { t } = useContext(TranslationContext);
    const dateString = useMemo(() => (props.date ? new Date(props.date).toLocaleDateString(undefined, props.dateOptions) : null), [props.date, props.dateOptions])
    return (
        <div className="flex flex-col lg:flex-row gap-2 lg:gap-8 mb-8">
            { props.author && <div className="italic">{t('by', { author: props.author })}</div> }
            { props.date && <div>{ dateString }</div> }
        </div>
    );
}

export default Byline;