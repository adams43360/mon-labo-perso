/**
 * Configuration réseau optionnelle : certains environnements (ex. sandbox CI/agent)
 * exigent de passer par un proxy HTTP et de faire confiance à un CA additionnel pour
 * ce proxy. Sans HTTP_PROXY/HTTPS_PROXY dans l'environnement, ce module ne fait
 * rien — sur une machine normale (poste perso), les appels fetch() partent directement.
 * Identique à l'expérience 004.
 */
import { existsSync, readFileSync } from "node:fs";
import { EnvHttpProxyAgent, setGlobalDispatcher } from "undici";

const hasProxyEnv = Boolean(
  process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy,
);

if (hasProxyEnv) {
  const extraCaPath = process.env.NODE_EXTRA_CA_CERTS ?? "/etc/ssl/certs/mitm-proxy-ca.pem";
  const ca = existsSync(extraCaPath) ? readFileSync(extraCaPath, "utf8") : undefined;
  setGlobalDispatcher(new EnvHttpProxyAgent({ requestTls: ca ? { ca } : undefined }));
}
