import { useState } from 'react';

import { ObjectMap, ProxySettings } from '../types';
import { validatedOrCorrectedProxySettings } from '../util/util';
import { ValidationError } from '../util/validation';

type Validations = ObjectMap<string>;
type ProxySettingValidator = (proxySettings: ProxySettings) => ProxySettings | undefined;
type MessageResetter = () => void;

export const useValidateProxySettings = (): [ProxySettingValidator, Validations, MessageResetter] => {
  const [validations, setValidations] = useState<Validations>({});
  const validateProxySettings = (proxySettings: ProxySettings): ProxySettings | undefined => {
    try {
      const validatedProxySettings = validatedOrCorrectedProxySettings(proxySettings);
      return validatedProxySettings;
    } catch (err) {
      if (err.name === 'ValidationError') {
        setValidations((err as ValidationError).validations);
      }
    }
  };
  return [validateProxySettings, validations, () => setValidations({})];
};
