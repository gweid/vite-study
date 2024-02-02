import MusicLogo from '@assets/images/music.png'
import Algorand from "@assets/svgs/algorand.svg?react"
import { version } from '../../../package.json'
import getImgBaseUrl from '@utils/getImgBaseUrl'

const StaticCom = () => {
  return (
    <div className="text-center">
      <h3>静态资源</h3>
      <img src={MusicLogo} className='w-60 h-50' />
      <img src={getImgBaseUrl('../images/music.png')} className='w-60 h-50' />
      <div><Algorand className='w-30 h-30 mt-10'/></div>
      <div className='mt-10'>版本：{version}</div>
    </div>
  )
}

export default StaticCom
