const IframeEmbed = (props: any) => (
  <div
    className='w-3/4 mx-auto flex items-center justify-center'
  >
    <iframe
      height={props.height || '450'}
      src={props.src} width={props.width || '100%'}
    />
  </div>
);

export default IframeEmbed;