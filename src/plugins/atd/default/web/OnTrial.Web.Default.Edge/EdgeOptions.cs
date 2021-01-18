﻿using System.Collections.Generic;

namespace OnTrial.Web.Default.Edge
{
    public class EdgeOptions : OptionsService
    {
        private const string DefaultPlatformName = "windows";
        private const string DefaultBrowserName = "MicrosoftEdge";
        private const string DefaultCapabilityKey = "se:edgeOptions";

        public List<string> Arguments;
        public bool StartMaximized = true;
        public bool UseChromium = true;

        public EdgeOptions() : base(DefaultPlatformName, DefaultBrowserName, DefaultCapabilityKey) { }

        public override Dictionary<string, object> ToCapabilities()
        {
            Dictionary<string, object> options, additionalOptions;
            BuildBaseOptions(out options);
            options.Add("ms:edgeChromium", UseChromium);
            BuildAdditionalOptions(out additionalOptions);

            if (additionalOptions.IsNullOrEmpty() == false)
                options.Set(CapabilityKey, additionalOptions);

            return options;
        }

        private void BuildAdditionalOptions(out Dictionary<string, object> pOptions)
        {
            pOptions = new Dictionary<string, object>();
            Arguments = new List<string>();

            if (this.StartMaximized)
                Arguments.Add("--start-maximized");

            //pOptions.Add("ignoreProtectedModeSettings", true);
            //pOptions.Add("ignoreZoomSetting", true);
        }
    }
}
