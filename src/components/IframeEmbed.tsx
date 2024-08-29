import { useEffect } from "react";

const IframeEmbed = (props: any) => {
    console.log(props);
    useEffect(() => {
        console.log(props);
    }, []);
    
    return (
        <div className="w-3/4 mx-auto flex items-center justify-center">
            <iframe src={props.src} width={props.width || '100%'} height={props.height || '450'} />
        </div>
    )
}

export default IframeEmbed;