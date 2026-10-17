describe('BraceExpansionDependencyVersion', () => {
  describe('installed version', () => {
    it('is at least 5.0.11, the first version patching both GHSA-6j4f-fj2g-mc7p (brace-expansion < 5.0.10) and GHSA-qhr7-859c-m2p7 (brace-expansion < 5.0.11)', () => {
      // brace-expansion is not a direct dependency of this project: it is pulled
      // in transitively by minimatch (used directly in
      // GetDefinitionByPathUseCase.ts), via minimatch's declared
      // "brace-expansion": "^5.0.8" range. This asserts the resolved, installed
      // version against the two Dependabot alerts' combined patched floor,
      // without adding any new declared dependency (no semver package) to
      // perform the comparison.
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

      const installedBraceExpansionVersion: string =
        require('brace-expansion/package.json').version;
      const firstVersionPatchingBothDependabotAlerts = '5.0.11';

      expect(
        isVersionAtLeastMinimum(
          installedBraceExpansionVersion,
          firstVersionPatchingBothDependabotAlerts,
        ),
      ).toBe(true);
    });
  });
});
