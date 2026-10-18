import { readFileSync } from 'fs';
import { join } from 'path';

describe('DevelopmentToolchainDependencyVersion', () => {
  describe('installed versions', () => {
    it('are at least the versions of the 2026-10-18 weekly dependency refresh', () => {
      const isVersionAtLeastMinimum = (
        installedVersion: string,
        minimumRequiredVersion: string,
      ): boolean => {
        const installedVersionParts = installedVersion.split('.').map(Number);
        const minimumRequiredVersionParts = minimumRequiredVersion
          .split('.')
          .map(Number);
        const partCount = Math.max(
          installedVersionParts.length,
          minimumRequiredVersionParts.length,
        );
        for (let partIndex = 0; partIndex < partCount; partIndex += 1) {
          const installedPart = installedVersionParts[partIndex] ?? 0;
          const minimumRequiredPart =
            minimumRequiredVersionParts[partIndex] ?? 0;
          if (installedPart > minimumRequiredPart) {
            return true;
          }
          if (installedPart < minimumRequiredPart) {
            return false;
          }
        }
        return true;
      };

      const testCases: ReadonlyArray<{
        packageName: string;
        minimumVersion: string;
      }> = [
        { packageName: '@babel/core', minimumVersion: '8.0.7' },
        { packageName: '@babel/eslint-parser', minimumVersion: '8.0.7' },
        { packageName: '@babel/preset-typescript', minimumVersion: '8.0.7' },
        { packageName: '@swc/core', minimumVersion: '1.16.18' },
        {
          packageName: 'conventional-changelog-conventionalcommits',
          minimumVersion: '10.4.1',
        },
        { packageName: 'prettier', minimumVersion: '3.9.10' },
      ];

      const packagesBelowMinimumVersion = testCases
        .map(({ packageName, minimumVersion }) => ({
          packageName,
          minimumVersion,
          installedVersion: JSON.parse(
            readFileSync(
              join(
                __dirname,
                '..',
                '..',
                '..',
                'node_modules',
                packageName,
                'package.json',
              ),
              'utf8',
            ),
          ).version as string,
        }))
        .filter(
          ({ installedVersion, minimumVersion }) =>
            !isVersionAtLeastMinimum(installedVersion, minimumVersion),
        );

      expect(packagesBelowMinimumVersion).toEqual([]);
    });
  });
});
