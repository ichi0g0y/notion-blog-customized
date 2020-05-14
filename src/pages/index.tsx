import Link from 'next/link'
import Header from '../components/header'
import ExtLink from '../components/ext-link'
import Features from '../components/features'
import GitHub from '../components/svgs/github'
import sharedStyles from '../styles/shared.module.css'

export default () => (
  <>
    <Header titlePre="Home" />
    <div className={sharedStyles.layout}>
      <img
        src="/zeit-and-notion.png"
        height="85"
        width="250"
        alt="Vercel + Notion"
      />
      <h1>My Notion Blog - Cutomized</h1>
      <h2>
        これは Notion Blog
        のカスタマイズ内容を公開するために作られたサンプルページです。
        <br />
        This is Customized Notion Blog Sample!
      </h2>
    </div>
  </>
)
