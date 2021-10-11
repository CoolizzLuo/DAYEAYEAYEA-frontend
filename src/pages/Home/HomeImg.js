import styled from 'styled-components'
import { COLOR, FONT_SIZE, MEDIA_QUERY } from '../../constants/style'
import { Link } from 'react-router-dom'

const CategoryImg = styled.div`
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 50vw;
  width: 100%;
  opacity: 0.7;
  font-size: ${FONT_SIZE.xxl};
  font-weight: bold;
  text-align: center;
  line-height: 50vw;
  ${MEDIA_QUERY.tablet} {
    font-size: ${FONT_SIZE.xxxl};
    height: 30vw;
    line-height: 30vw;
  }

  ${MEDIA_QUERY.desktop} {
    font-size: ${FONT_SIZE.xxxl};
    height: 20vw;
    line-height: 20vw;
  }
`

export function IndexImg({ children, imgUrl, color }) {
  return (
    <CategoryImg style={{ backgroundImage: `url(${imgUrl})`, color: color }}>
      {children}
    </CategoryImg>
  )
}
