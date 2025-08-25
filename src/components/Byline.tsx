interface BylineProps {
    author?: string;
    date?: string;
    t: any;
}

const Byline = (props: BylineProps) => (
    <div className="flex flex-col lg:flex-row gap-2 lg:gap-8 mb-8">
        { props.author && <div className="italic">{props.t('by', { author: props.author })}</div> }
        { props.date && <div>{props.date}</div> }
    </div>
);

export default Byline;