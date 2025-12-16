const title = "天地の輝き - The Shine of the Universe";
const description = "Star system discovery game.";
const author = "demid-v";

export default function Head() {
  return (
    <>
      {/* Recommended Meta Tags */}
      <meta charSet="utf-8" />
      <meta name="language" content="english" />
      <meta httpEquiv="content-type" content="text/html" />
      <meta name="author" content={author} />
      <meta name="designer" content={author} />
      <meta name="publisher" content={author} />

      {/* Search Engine Optimization Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="keywords"
        content="Universe,Space,Planets,Discovery,Randomly generated"
      />
      <meta name="robots" content="index,follow" />
      <meta name="distribution" content="web" />

      {/* Meta Tags for HTML pages on Mobile */}
      {/* <meta name="format-detection" content="telephone=yes"/>
        <meta name="HandheldFriendly" content="true"/>  */}
      <meta
        name="viewport"
        content="width=device-width, minimum-scale=1, initial-scale=1.0"
      />
      <meta name="theme-color" content="#000" />
      <link rel="shortcut icon" href="/icons/apple-touch-icon.png" />
    </>
  );
}
