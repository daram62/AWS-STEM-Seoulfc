declare module '@docusaurus/Link' {
  import type { ComponentProps } from 'react';
  
  export interface Props extends ComponentProps<'a'> {
    to?: string;
    href?: string;
    activeClassName?: string;
    isNavLink?: boolean;
    prependBaseUrlToHref?: boolean;
  }
  
  export default function Link(props: Props): JSX.Element;
}

declare module '@docusaurus/useDocusaurusContext' {
  export interface DocusaurusContext {
    siteConfig: {
      title: string;
      tagline: string;
      url: string;
      baseUrl: string;
      favicon: string;
      [key: string]: any;
    };
    [key: string]: any;
  }
  
  export default function useDocusaurusContext(): DocusaurusContext;
}

declare module '@docusaurus/router' {
  export { useHistory, useLocation, Redirect } from 'react-router-dom';
}

declare module '@docusaurus/BrowserOnly' {
  export interface Props {
    children: () => JSX.Element;
    fallback?: JSX.Element;
  }
  export default function BrowserOnly(props: Props): JSX.Element;
}
