import { getRelativeLocaleUrl } from 'astro:i18n';

interface Props {
  lang: string;
  post: any;
}

const PostCard = () => {
  const { lang, post } = props;

  return (
    <a
      className='hover:underline hover:font-semibold py-4 font-header'
      href={getRelativeLocaleUrl(lang, `posts/${post?._sys?.filename}`)}
      key={post?._sys?.filename}
    >
      <p>
        { post?.title }
      </p>
    </a>
  );
}

export default PostCard;
