function NavLinkLeft() {
  return (
    <div className="">
        <ul className="flex gap-12">
        {['home', 'app'].map((item) => (
          <li className="app__flex p-text" key={`link-${item}`}>
            <div />
            <a href={`#${item}`}>{item}</a>
          </li>
        ))} 
      </ul>
    </div>
  )
}

function NavLinkRight() {
  return(
    <div>
      <ul className="flex gap-12">
        {['auth', 'blog'].map((item) => (
          <li className="app__flex p-text" key={`link-${item}`}>
            <div />
            <a href={`#${item}`}>{item}</a>
          </li>
        ))} 
      </ul>
    </div>
  )
}

export { NavLinkRight, NavLinkLeft }
