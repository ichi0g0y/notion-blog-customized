import '../styles/global.css'
import ExtLink from '../components/ext-link'

export default ({ Component, pageProps }) => (
  <>
    <Component {...pageProps} />

    <footer>
      <span>Deploy your own!</span>
      <ExtLink href="https://zeit.co/new/project?template=https://github.com/ichi0g0y/notion-blog-customized/tree/master">
        <img
          src="https://zeit.co/button"
          height={46}
          width={132}
          alt="deploy to ZEIT button"
        />
      </ExtLink>
      <span>
        or{' '}
        <ExtLink href="https://github.com/ichi0g0y/notion-blog-customized">
          view source
        </ExtLink>
      </span>
    </footer>
  </>
)
