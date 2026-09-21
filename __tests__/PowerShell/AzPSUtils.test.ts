import * as path from "path";
import { AzPSConstants, AzPSUtils } from "../../src/PowerShell/AzPSUtils";

describe("Setting PSModulePath for the GitHub runner", () => {

    const azPath = AzPSConstants.DEFAULT_AZ_PATH_ON_LINUX;

    beforeEach(() => {
        process.env.RUNNER_OS = 'Linux';
    });

    test('prepends the Az path when it is not on PSModulePath', async () => {
        process.env.PSModulePath = '/opt/microsoft/powershell/7/Modules';

        await AzPSUtils.setPSModulePathForGitHubRunner();

        expect(process.env.PSModulePath.split(path.delimiter)[0]).toBe(azPath);
    });

    test('leaves PSModulePath alone when the Az path is already on it', async () => {
        const existing = ['/opt/microsoft/powershell/7/Modules', azPath].join(path.delimiter);
        process.env.PSModulePath = existing;

        await AzPSUtils.setPSModulePathForGitHubRunner();

        expect(process.env.PSModulePath).toBe(existing);
    });

    test('leaves PSModulePath alone when a directory under the Az path is already on it', async () => {
        const existing = ['/opt/microsoft/powershell/7/Modules', `${azPath}/az_15.6.1`].join(path.delimiter);
        process.env.PSModulePath = existing;

        await AzPSUtils.setPSModulePathForGitHubRunner();

        expect(process.env.PSModulePath).toBe(existing);
    });
});
