import './LogoLoader.scss'
export function LogoLoader({ decorative = false }){
    return(
        <div className="logo-loader" role={decorative ? undefined : "status"} aria-label={decorative ? undefined : "Chargement en cours"} aria-hidden={decorative || undefined}>
            <svg className="logo-loader__svg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">

              <defs>

                <linearGradient id="main" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E79A99"></stop>
                  <stop offset="50%" stopColor="#D27271"></stop>
                  <stop offset="100%" stopColor="#B95C5B"></stop>
                </linearGradient>

                <linearGradient id="light" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F2B8B7"></stop>
                  <stop offset="100%" stopColor="#D27271"></stop>
                </linearGradient>

                <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.25"></feDropShadow>
                </filter>
              </defs>

              <circle className="logo-loader__ring" pathLength="1" cx="256" cy="256" r="170" fill="none" stroke="url(#light)" strokeWidth="18"></circle>

              <polygon className="logo-loader__hexagon" pathLength="1" points="256,160 343,208 343,304 256,352 169,304 169,208" fill="none" stroke="url(#main)" strokeWidth="14" strokeLinejoin="round"></polygon>

              <g className="logo-loader__branches" stroke="#FDFDFD" strokeWidth="12" strokeLinecap="round">

                  <line className="logo-loader__branch" x1="256" y1="176" x2="256" y2="238"></line>
                  <line className="logo-loader__branch" x1="193" y1="220" x2="240" y2="247"></line>
                  <line className="logo-loader__branch" x1="319" y1="220" x2="272" y2="247"></line>
                  <line className="logo-loader__branch" x1="193" y1="292" x2="240" y2="265"></line>
                  <line className="logo-loader__branch" x1="319" y1="292" x2="272" y2="265"></line>
                  <line className="logo-loader__branch" x1="256" y1="336" x2="256" y2="274"></line>

              </g>

              <circle className="logo-loader__center" cx="256" cy="256" r="28" fill="#FFFFFF" filter="url(#shadow)"></circle>

              <g className="logo-loader__nodes" filter="url(#shadow)">
                  <circle className="logo-loader__node" cx="256" cy="168" r="18" fill="#F2B8B7"></circle>
                  <circle className="logo-loader__node" cx="180" cy="212" r="18" fill="#D27271"></circle>
                  <circle className="logo-loader__node" cx="332" cy="212" r="18" fill="#DE8A89"></circle>
                  <circle className="logo-loader__node" cx="180" cy="300" r="18" fill="#D96E6D"></circle>
                  <circle className="logo-loader__node" cx="332" cy="300" r="18" fill="#E7A3A2"></circle>
                  <circle className="logo-loader__node" cx="256" cy="344" r="18" fill="#C85F5E"></circle>
              </g>

            </svg>
        </div>
    )
}
