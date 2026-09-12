import useInView from '../hooks/useInView';

export default function Reveal({
  as: Comp = 'div',
  children,
  className = '',
  delay = 0,
  variant = 'up',
}) {
  const [ref, visible] = useInView();

  return (
    <Comp
      ref={ref}
      className={`ct-reveal ct-reveal-${variant} ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Comp>
  );
}
