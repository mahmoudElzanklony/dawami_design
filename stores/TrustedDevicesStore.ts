import {BaseStore} from "~/stores/BaseStore";

export const useTrustedDevicesStore = BaseStore('trusted-devices','/trusted-devices',{
    tableName:'trusted_devices',
});