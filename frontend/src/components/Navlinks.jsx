function NavLinkRight({ onAuthClick }) {
  return(
    <div>
      <ul className="flex gap-12">
        {['auth', 'blog'].map((item) => (
          <li className="app__flex p-text" key={`link-${item}`}>
            <div />
            {item === 'auth' ? (
              <button type="button" onClick={onAuthClick}>{item}</button>
            ) : (
              <a href={`#${item}`}>{item}</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NavLinkRight
