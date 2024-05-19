<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width="1080"
    zoomAndPan="magnify"
    viewBox="0 0 810 809.999993"
    height="1080"
    preserveAspectRatio="xMidYMid meet"
    version="1.0"
  >
    <defs>
      <filter x="0%" y="0%" width="100%" height="100%" id="2c6ebbb8aa">
        <feColorMatrix
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          color-interpolation-filters="sRGB"
        />
      </filter>
      <filter x="0%" y="0%" width="100%" height="100%" id="270ea7cd6c">
        <feColorMatrix
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0.2126 0.7152 0.0722 0 0"
          color-interpolation-filters="sRGB"
        />
      </filter>
      <image
        x="0"
        y="0"
        width="32"
        xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAAAAABWESUoAAAAAmJLR0QA/4ePzL8AAAELSURBVDiNrZGxSsNgFIW/xgwSKIiTIGRRhw4O4e8r6EOIg5PZu3bJKIKDWxPERUF8gU4+gj6BSlUEByvdnKLHIX9MlCYB41nuhfPdey5cyBQdUMioUO5Lh3VAJElH1UCU9ccdC3jGGGNMmEppyZcSp3QIwZuU7pZ96cSp8CdjaTyRdPpN9GdSumP957VYiv0HSRfur3lnEV637wGetl7AbgiulvnYOwfojGYBxFIMm9NL9+c8gLNODrCxAMBqng+4fN4Vl99mZWUJ3gcDC1Soa2xAFZBr7obHsAGYJkXfGNEemHtD76wB8EzbCIAQ8Ic1QAKYYZuIfcCvA2Jb/x5xA3i9GqAPmOv/eNYXC3menRY6pRsAAAAASUVORK5CYII="
        id="7debe72125"
        height="32"
        preserveAspectRatio="xMidYMid meet"
      />
      <mask id="36a1585eca">
        <g filter="url(#2c6ebbb8aa)">
          <g
            filter="url(#270ea7cd6c)"
            transform="matrix(25.312499, 0, 0, 25.312499, 0.0000035, 0.00002)"
          >
            <image
              x="0"
              y="0"
              width="32"
              xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAAAAABWESUoAAAAAmJLR0QA/4ePzL8AAAELSURBVDiNrZGxSsNgFIW/xgwSKIiTIGRRhw4O4e8r6EOIg5PZu3bJKIKDWxPERUF8gU4+gj6BSlUEByvdnKLHIX9MlCYB41nuhfPdey5cyBQdUMioUO5Lh3VAJElH1UCU9ccdC3jGGGNMmEppyZcSp3QIwZuU7pZ96cSp8CdjaTyRdPpN9GdSumP957VYiv0HSRfur3lnEV637wGetl7AbgiulvnYOwfojGYBxFIMm9NL9+c8gLNODrCxAMBqng+4fN4Vl99mZWUJ3gcDC1Soa2xAFZBr7obHsAGYJkXfGNEemHtD76wB8EzbCIAQ8Ic1QAKYYZuIfcCvA2Jb/x5xA3i9GqAPmOv/eNYXC3menRY6pRsAAAAASUVORK5CYII="
              height="32"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>
        </g>
      </mask>
      <image
        x="0"
        y="0"
        width="32"
        xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAABmJLR0QA/wD/AP+gvaeTAAACJUlEQVRIic2WwW7TQBCGv5k0AhcpiPZCqZszV04k5cKrtELiNfoeUFTeAe6cGpAK7wC1ql4aIIdaqZwZDm4de21CkqYSvyxLtne+2dmZnbVQVbx7iIOACYBIMtijSd3nR4CpNX4tpM10FwREHN/ePZyNmNdBhX4tR3z8a6sTfwMPLM0mCzhoogOIy/3O+Sh5Fm18hIOqrWfZWE2DK5iIzqDfOCHuvUuHJ9HmetmH2US1VcThuIllmlUniPyDXhqbDL5HG+vp8LIWCjsvDs1wXMtJFXA0oAcBlh59u9dNh5fR04iXFQdP+m/NUKVCR3KyBnNXqdSVa2tqIWz3dtLHaUAHHHcrLYDkc5PkeF8pfVDDrVLXYhNMcgtApbKMOR2orwxCvoE0+byXGxlmEtaieAFH4PTej2iynj/G/feC/pV+vH/9Itr8kF6cxP3YwYPRhZE7Lkn3QfRzmGbnfDoAdnpHLgLl3SBe2y6aXpx04s7odCRwNnhVo5MM9nAZPWx3fl+ljzZyOoCjVsHV6cAaHIwSgPzeqORLQzuqF3VjmdcXZF4t1iqWkmfZOM/cjOt2EbQ0KOu61pZ2cPb19TzDbrNEc2n5CLZ6b65PJZnVJZePQF0dn03nNhEI0va2ySJn8kJqaioNWj6CQJUuIRRtc/VVJE5rMsXeeZmu3oELk9Y08yvLQaVaSwn5j3dyoOCsKQK6myqyKXaVOUgG+9z8dRe68xz8Aak74lOtND/JAAAAAElFTkSuQmCC"
        id="8209baaec5"
        height="32"
        preserveAspectRatio="xMidYMid meet"
      />
    </defs>
    <rect
      x="-81"
      width="972"
      y="-80.999999"
      height="971.999992"
      fill-opacity="0"
    />
    <rect
      x="-81"
      width="972"
      y="-80.999999"
      height="971.999992"
      fill-opacity="0"
    />
    <g mask="url(#36a1585eca)">
      <g transform="matrix(25.312499, 0, 0, 25.312499, 0.0000035, 0.00002)">
        <image
          x="0"
          y="0"
          width="32"
          xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAABmJLR0QA/wD/AP+gvaeTAAACJUlEQVRIic2WwW7TQBCGv5k0AhcpiPZCqZszV04k5cKrtELiNfoeUFTeAe6cGpAK7wC1ql4aIIdaqZwZDm4de21CkqYSvyxLtne+2dmZnbVQVbx7iIOACYBIMtijSd3nR4CpNX4tpM10FwREHN/ePZyNmNdBhX4tR3z8a6sTfwMPLM0mCzhoogOIy/3O+Sh5Fm18hIOqrWfZWE2DK5iIzqDfOCHuvUuHJ9HmetmH2US1VcThuIllmlUniPyDXhqbDL5HG+vp8LIWCjsvDs1wXMtJFXA0oAcBlh59u9dNh5fR04iXFQdP+m/NUKVCR3KyBnNXqdSVa2tqIWz3dtLHaUAHHHcrLYDkc5PkeF8pfVDDrVLXYhNMcgtApbKMOR2orwxCvoE0+byXGxlmEtaieAFH4PTej2iynj/G/feC/pV+vH/9Itr8kF6cxP3YwYPRhZE7Lkn3QfRzmGbnfDoAdnpHLgLl3SBe2y6aXpx04s7odCRwNnhVo5MM9nAZPWx3fl+ljzZyOoCjVsHV6cAaHIwSgPzeqORLQzuqF3VjmdcXZF4t1iqWkmfZOM/cjOt2EbQ0KOu61pZ2cPb19TzDbrNEc2n5CLZ6b65PJZnVJZePQF0dn03nNhEI0va2ySJn8kJqaioNWj6CQJUuIRRtc/VVJE5rMsXeeZmu3oELk9Y08yvLQaVaSwn5j3dyoOCsKQK6myqyKXaVOUgG+9z8dRe68xz8Aak74lOtND/JAAAAAElFTkSuQmCC"
          height="32"
          preserveAspectRatio="xMidYMid meet"
        />
      </g>
    </g>
  </svg>
</template>
