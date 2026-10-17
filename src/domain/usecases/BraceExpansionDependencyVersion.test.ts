describe('BraceExpansionDependencyVersion', () => {
  describe('installed version', () => {
    it('is at least 5.0.11, the first version patching both GHSA-6j4f-fj2g-mc7p (brace-expansion < 5.0.10) and GHSA-qhr7-859c-m2p7 (brace-expansion < 5.0.11)', () => {
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
