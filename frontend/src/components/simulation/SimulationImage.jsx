import { useState } from 'react';
import { API_BASE_URL } from '../../services/api';

const source = value => value?.startsWith('/uploads/') ? `${API_BASE_URL.replace(/\/api\/?$/, '')}${value}` : value;

export default function SimulationImage({ src, fallback, alt, ...props }) {
  const [failedSource, setFailedSource] = useState('');
  const current = failedSource === src ? fallback : src;
  return <img {...props} src={source(current)} alt={alt} onError={() => {
    if (fallback && current !== fallback) setFailedSource(src);
  }} />;
}
