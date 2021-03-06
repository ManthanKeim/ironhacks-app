import { Img } from '../img'

const ShowcaseCard = ({ title, image, description, likes, url }) => {
  return (
    <div className="card showcase_card depth-1">
      <div className="card__content">
        <h3 className="title showcase_card__title">{title}</h3>
        <Img
          responsive={false}
          baseUrl={'https://firebasestorage.googleapis.com/v0/b/ironhacks-c406a.appspot.com/o'}
          filePath={'media%2Fimg%2F'}
          fileName={image}
          imgClass="card__image"
          alt={title}
        />
        <p className="description showcase_card__description">{description}</p>
      </div>

      <div className="card__info showcase_card__info">
        <div>
          <i className="material-icons icon_thumb">thumb_up</i>
          <span className="showcase_card__like">{likes}</span>
        </div>
        <div>
          <a href={url} className="card__link">
            View App
          </a>
        </div>
      </div>
    </div>
  )
}

ShowcaseCard.defaultProps = {
  image: '',
  title: 'Project Title',
  description: 'Project Description',
  url: '',
  likes: '0',
}

export default ShowcaseCard
