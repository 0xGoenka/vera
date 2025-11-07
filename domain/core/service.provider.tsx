import { createContext, useContext } from "react";
import { StreamApi } from "../services/stream/stream.api";
import { StreamService } from "../services/stream/stream.service";

const streamApi = new StreamApi();
const streamService = new StreamService(streamApi);
export const services = {
  streamService,
};

export type Services = typeof services;
export const ServicesContext = createContext<Services | null>(null);
export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
};

export function useServices(): Services {
  const services = useContext(ServicesContext);
  if (!services) {
    throw Error("ServiceContext not defined");
  }
  return services;
}
