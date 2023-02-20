const { default: Head } = require("next/head");

const SiteHeader = ({ title, content }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={content} />
    </Head>
  );
};

export default SiteHeader;
