import SaveButton from "./SaveButton";

// React twin of PropertyCard.astro, for use inside interactive islands
// (filterable listings, saved page) that render cards on the client.
export interface CardData {
  id: string;
  href: string;
  image: string;
  title: string;
  location: string;
  price: string;
  badge?: string;
  facts?: string[];
  saveId?: string;
}

export default function PropertyCardR({ data }: { data: CardData }) {
  return (
    <a className="ew-card-link" href={data.href} aria-label={data.title}>
      <article className="pcard">
        <div className="pcard__media ew-grain">
          <img src={data.image} alt={data.title} loading="lazy" decoding="async" />
          {data.badge && (
            <div className="pcard__badge">
              <span className="badge badge--light">{data.badge}</span>
            </div>
          )}
          {data.saveId && (
            <div className="pcard__save">
              <SaveButton id={data.saveId} />
            </div>
          )}
        </div>
        <div className="pcard__body">
          <div className="pcard__loc">{data.location}</div>
          <h3 className="pcard__title">{data.title}</h3>
          {data.facts && data.facts.length > 0 && (
            <div className="pcard__facts">
              {data.facts.map((f, i) => (
                <span key={i}>{f}</span>
              ))}
            </div>
          )}
          <div className="pcard__price">{data.price}</div>
        </div>
      </article>
    </a>
  );
}
