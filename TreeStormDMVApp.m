
classdef TreeStormDMVApp < matlab.apps.AppBase
    % TreeStormDMVApp
    % Unified MATLAB app for:
    % 1) interactive tree stability analysis,
    % 2) NOAA Storm Events CSV integration,
    % 3) automatic report generation tying engineering results to real storms.
    %
    % RUN:
    %   app = TreeStormDMVApp;
    %
    % OPTIONAL INPUT FILES:
    %   NOAA Storm Events CSV:
    %       Bulk download source: NOAA NCEI Storm Events Database
    %       Typical columns used if present:
    %       BEGIN_DATE_TIME, STATE, EVENT_TYPE, CZ_NAME, EPISODE_NARRATIVE,
    %       EVENT_NARRATIVE, MAGNITUDE, MAGNITUDE_TYPE
    %
    %   Local observation CSV (optional):
    %       Suggested columns:
    %       Date, Trail, Species, Notes, FallenCount
    %
    % MODEL NOTES:
    %   - This is a first-pass engineering model meant for education and screening.
    %   - Failure is approximated as the lower threshold of:
    %       (a) trunk bending failure
    %       (b) root-soil overturning failure
    %   - Summer storms are modeled by larger canopy drag.
    %
    % USER ACTIONS:
    %   - Adjust species, geometry, season, soil, and wind
    %   - Load NOAA data
    %   - Optional: load local tree-failure observations
    %   - Click "Generate Report" to export a text report

    properties (Access = public)
        UIFigure matlab.ui.Figure
        Grid matlab.ui.container.GridLayout

        LeftPanel matlab.ui.container.Panel
        CenterPanel matlab.ui.container.Panel
        RightPanel matlab.ui.container.Panel

        % Inputs
        SpeciesDropDown matlab.ui.control.DropDown
        RootTypeDropDown matlab.ui.control.DropDown
        SoilDropDown matlab.ui.control.DropDown
        SeasonDropDown matlab.ui.control.DropDown

        DensityField matlab.ui.control.NumericEditField
        DiameterField matlab.ui.control.NumericEditField
        HeightField matlab.ui.control.NumericEditField
        CurvatureField matlab.ui.control.NumericEditField
        RootWidthField matlab.ui.control.NumericEditField
        RootDepthField matlab.ui.control.NumericEditField
        DragCoeffField matlab.ui.control.NumericEditField
        WindSlider matlab.ui.control.Slider
        WindValueLabel matlab.ui.control.Label

        % Buttons
        LoadNOAAButton matlab.ui.control.Button
        LoadObsButton matlab.ui.control.Button
        ReportButton matlab.ui.control.Button
        ReplayButton matlab.ui.control.Button

        % Center graphics
        Axes matlab.ui.control.UIAxes
        ReportArea matlab.ui.control.TextArea

        % Outputs
        BaseShearValue matlab.ui.control.NumericEditField
        BaseMomentValue matlab.ui.control.NumericEditField
        MaxStressValue matlab.ui.control.NumericEditField
        RootMomentValue matlab.ui.control.NumericEditField
        TrunkVcritValue matlab.ui.control.NumericEditField
        RootVcritValue matlab.ui.control.NumericEditField
        GoverningVcritValue matlab.ui.control.NumericEditField
        SafetyFactorValue matlab.ui.control.NumericEditField
        FailureModeLabel matlab.ui.control.Label
        StatusLamp matlab.ui.control.Lamp

        % Data
        NOAAData table = table()
        ObsData table = table()
        LastAnalysis struct = struct()
    end

    properties (Constant)
        rho_air = 1.225;       % kg/m^3
        g = 9.81;              % m/s^2
        woodStrengthGreen = struct( ...
            'Oak', 55e6, ...    % Pa, rough educational screening value
            'Maple', 50e6, ...
            'Bamboo', 80e6 );   % bamboo culm can be strong in bending

        speciesDefaults = struct( ...
            'Oak',    struct('rho', 900, 'rootType', 'Plate',   'CdLeafOn', 1.20, 'CdLeafOff', 0.60), ...
            'Maple',  struct('rho', 700, 'rootType', 'Moderate','CdLeafOn', 1.10, 'CdLeafOff', 0.55), ...
            'Bamboo', struct('rho', 650, 'rootType', 'Fibrous', 'CdLeafOn', 0.85, 'CdLeafOff', 0.65) )
    end

    methods (Access = public)

        function app = TreeStormDMVApp
            createComponents(app);
            applySpeciesDefaults(app);
            updateModel(app);
        end

        function delete(app)
            if isvalid(app.UIFigure)
                delete(app.UIFigure);
            end
        end
    end

    methods (Access = private)

        function createComponents(app)

            app.UIFigure = uifigure('Name','Tree Storm DMV Analyzer','Position',[60 60 1450 820]);

            app.Grid = uigridlayout(app.UIFigure,[1 3]);
            app.Grid.ColumnWidth = {350, '1x', 360};
            app.Grid.RowHeight = {'1x'};

            app.LeftPanel = uipanel(app.Grid,'Title','Inputs');
            app.LeftPanel.Layout.Row = 1; app.LeftPanel.Layout.Column = 1;

            app.CenterPanel = uipanel(app.Grid,'Title','Visualization and Report');
            app.CenterPanel.Layout.Row = 1; app.CenterPanel.Layout.Column = 2;

            app.RightPanel = uipanel(app.Grid,'Title','Outputs');
            app.RightPanel.Layout.Row = 1; app.RightPanel.Layout.Column = 3;

            % ---------- Left panel ----------
            gl = uigridlayout(app.LeftPanel,[18 2]);
            gl.RowHeight = repmat({28},1,18);
            gl.ColumnWidth = {130,'1x'};

            uilabel(gl,'Text','Species');
            app.SpeciesDropDown = uidropdown(gl,'Items',{'Oak','Maple','Bamboo'}, ...
                'Value','Oak','ValueChangedFcn',@(src,evt)onSpeciesChanged(app));

            uilabel(gl,'Text','Root type');
            app.RootTypeDropDown = uidropdown(gl,'Items',{'Plate','Moderate','Fibrous','Taproot'}, ...
                'Value','Plate','ValueChangedFcn',@(src,evt)updateModel(app));

            uilabel(gl,'Text','Soil');
            app.SoilDropDown = uidropdown(gl,'Items',{'Dry','Normal','Saturated'}, ...
                'Value','Normal','ValueChangedFcn',@(src,evt)updateModel(app));

            uilabel(gl,'Text','Season');
            app.SeasonDropDown = uidropdown(gl,'Items',{'Leaf-on (Summer)','Leaf-off (Winter)'}, ...
                'Value','Leaf-on (Summer)','ValueChangedFcn',@(src,evt)applySpeciesDefaults(app));

            uilabel(gl,'Text','Density (kg/m^3)');
            app.DensityField = uieditfield(gl,'numeric','Limits',[100 1500], ...
                'ValueDisplayFormat','%.0f','ValueChangedFcn',@(src,evt)updateModel(app));

            uilabel(gl,'Text','Diameter base (m)');
            app.DiameterField = uieditfield(gl,'numeric','Limits',[0.03 2.0], ...
                'Value',0.60,'ValueDisplayFormat','%.3f','ValueChangedFcn',@(src,evt)updateModel(app));

            uilabel(gl,'Text','Height (m)');
            app.HeightField = uieditfield(gl,'numeric','Limits',[0.5 60], ...
                'Value',18,'ValueDisplayFormat','%.2f','ValueChangedFcn',@(src,evt)updateModel(app));

            uilabel(gl,'Text','Curvature factor');
            app.CurvatureField = uieditfield(gl,'numeric','Limits',[0 1], ...
                'Value',0.20,'ValueDisplayFormat','%.2f','Tooltip','0 = straight, 1 = strongly arched', ...
                'ValueChangedFcn',@(src,evt)updateModel(app));

            uilabel(gl,'Text','Root width (m)');
            app.RootWidthField = uieditfield(gl,'numeric','Limits',[0.1 20], ...
                'Value',4.0,'ValueDisplayFormat','%.2f','ValueChangedFcn',@(src,evt)updateModel(app));

            uilabel(gl,'Text','Root depth (m)');
            app.RootDepthField = uieditfield(gl,'numeric','Limits',[0.05 5], ...
                'Value',0.90,'ValueDisplayFormat','%.2f','ValueChangedFcn',@(src,evt)updateModel(app));

            uilabel(gl,'Text','Drag coefficient');
            app.DragCoeffField = uieditfield(gl,'numeric','Limits',[0.1 2.5], ...
                'Value',1.20,'ValueDisplayFormat','%.2f','ValueChangedFcn',@(src,evt)updateModel(app));

            uilabel(gl,'Text','Wind speed (m/s)');
            windPanel = uipanel(gl,'BorderType','none');
            wg = uigridlayout(windPanel,[1 2]);
            wg.ColumnWidth = {'1x',60};
            app.WindSlider = uislider(wg,'Limits',[0 50],'Value',20, ...
                'ValueChangedFcn',@(src,evt)updateModel(app), ...
                'ValueChangingFcn',@(src,evt)onWindChanging(app,evt));
            app.WindValueLabel = uilabel(wg,'Text','20.0');

            app.LoadNOAAButton = uibutton(gl,'Text','Load NOAA CSV', ...
                'ButtonPushedFcn',@(src,evt)loadNOAA(app));
            app.LoadNOAAButton.Layout.Column = [1 2];

            app.LoadObsButton = uibutton(gl,'Text','Load Local Observations CSV', ...
                'ButtonPushedFcn',@(src,evt)loadObservations(app));
            app.LoadObsButton.Layout.Column = [1 2];

            app.ReplayButton = uibutton(gl,'Text','Storm Replay', ...
                'ButtonPushedFcn',@(src,evt)stormReplay(app));
            app.ReplayButton.Layout.Column = [1 2];

            app.ReportButton = uibutton(gl,'Text','Generate Report', ...
                'ButtonPushedFcn',@(src,evt)generateReport(app));
            app.ReportButton.Layout.Column = [1 2];

            % ---------- Center panel ----------
            gc = uigridlayout(app.CenterPanel,[2 1]);
            gc.RowHeight = {'2x','1x'};

            app.Axes = uiaxes(gc);
            title(app.Axes,'Tree Mechanics Visualization');
            xlabel(app.Axes,'Horizontal distance (m)');
            ylabel(app.Axes,'Vertical distance (m)');
            grid(app.Axes,'on');

            app.ReportArea = uitextarea(gc,'Editable','off');
            app.ReportArea.Value = {'Load NOAA data or adjust the model. Then generate a report.'};

            % ---------- Right panel ----------
            gr = uigridlayout(app.RightPanel,[12 2]);
            gr.RowHeight = repmat({28},1,12);
            gr.ColumnWidth = {160,'1x'};

            uilabel(gr,'Text','Base shear (kN)');
            app.BaseShearValue = uieditfield(gr,'numeric','Editable','off','ValueDisplayFormat','%.3f');

            uilabel(gr,'Text','Base moment (kN*m)');
            app.BaseMomentValue = uieditfield(gr,'numeric','Editable','off','ValueDisplayFormat','%.3f');

            uilabel(gr,'Text','Max stress (MPa)');
            app.MaxStressValue = uieditfield(gr,'numeric','Editable','off','ValueDisplayFormat','%.3f');

            uilabel(gr,'Text','Root resistance (kN*m)');
            app.RootMomentValue = uieditfield(gr,'numeric','Editable','off','ValueDisplayFormat','%.3f');

            uilabel(gr,'Text','Trunk Vcrit (m/s)');
            app.TrunkVcritValue = uieditfield(gr,'numeric','Editable','off','ValueDisplayFormat','%.3f');

            uilabel(gr,'Text','Root Vcrit (m/s)');
            app.RootVcritValue = uieditfield(gr,'numeric','Editable','off','ValueDisplayFormat','%.3f');

            uilabel(gr,'Text','Governing Vcrit (m/s)');
            app.GoverningVcritValue = uieditfield(gr,'numeric','Editable','off','ValueDisplayFormat','%.3f');

            uilabel(gr,'Text','Safety factor');
            app.SafetyFactorValue = uieditfield(gr,'numeric','Editable','off','ValueDisplayFormat','%.3f');

            uilabel(gr,'Text','Failure mode');
            app.FailureModeLabel = uilabel(gr,'Text','-');

            uilabel(gr,'Text','Status');
            statusPanel = uipanel(gr,'BorderType','none');
            sg = uigridlayout(statusPanel,[1 2]);
            sg.ColumnWidth = {40,'1x'};
            app.StatusLamp = uilamp(sg,'Color',[0 1 0]);
            uilabel(sg,'Text','Safe / Fail');

            % filler
            uilabel(gr,'Text','NOAA rows loaded');
            uilabel(gr,'Text','0','Tag','NOAARowsLabel');
        end

        function onSpeciesChanged(app)
            applySpeciesDefaults(app);
        end

        function applySpeciesDefaults(app)
            sp = app.SpeciesDropDown.Value;
            defs = app.speciesDefaults.(sp);
            app.DensityField.Value = defs.rho;

            switch app.SeasonDropDown.Value
                case 'Leaf-on (Summer)'
                    app.DragCoeffField.Value = defs.CdLeafOn;
                otherwise
                    app.DragCoeffField.Value = defs.CdLeafOff;
            end

            % default root architecture by species
            switch sp
                case 'Oak'
                    app.RootTypeDropDown.Value = 'Plate';
                    if app.RootWidthField.Value < 4.0, app.RootWidthField.Value = 4.0; end
                    if app.RootDepthField.Value > 1.2 || app.RootDepthField.Value < 0.6
                        app.RootDepthField.Value = 0.90;
                    end
                case 'Maple'
                    app.RootTypeDropDown.Value = 'Moderate';
                    if app.RootWidthField.Value < 3.0, app.RootWidthField.Value = 3.2; end
                    if app.RootDepthField.Value > 1.4 || app.RootDepthField.Value < 0.5
                        app.RootDepthField.Value = 0.95;
                    end
                case 'Bamboo'
                    app.RootTypeDropDown.Value = 'Fibrous';
                    if app.RootWidthField.Value < 2.0, app.RootWidthField.Value = 2.5; end
                    if app.RootDepthField.Value > 0.8 || app.RootDepthField.Value < 0.2
                        app.RootDepthField.Value = 0.45;
                    end
            end

            updateModel(app);
        end

        function onWindChanging(app,evt)
            app.WindSlider.Value = evt.Value;
            app.WindValueLabel.Text = sprintf('%.1f',evt.Value);
            updateModel(app);
        end

        function updateModel(app)

            % Read inputs
            species = app.SpeciesDropDown.Value;
            rhoWood = app.DensityField.Value;
            d = app.DiameterField.Value;
            H = app.HeightField.Value;
            cf = app.CurvatureField.Value;
            B = app.RootWidthField.Value;
            z = app.RootDepthField.Value;
            Cd = app.DragCoeffField.Value;
            V = app.WindSlider.Value;
            app.WindValueLabel.Text = sprintf('%.1f',V);

            % Geometry
            A = pi*d^2/4;
            I = pi*d^4/64;
            c = d/2;

            % Simple crown / projected area approximation
            crownFactor = 0.65 + 1.10*strcmp(app.SeasonDropDown.Value,'Leaf-on (Summer)');
            curvatureAmplification = 1 + 0.45*cf;
            Aproj = max(0.1, crownFactor * d * H * curvatureAmplification);

            % Wind loading
            qeq = 0.5 * app.rho_air * Cd * V^2;  % N/m^2
            Fwind = qeq * Aproj;                 % total resultant N
            ycp = 0.60*H;                       % center of pressure
            Mwind = Fwind * ycp;                % N*m

            % Self-weight and offset gravity moment
            volume = A * H;
            W = rhoWood * app.g * volume;       % N
            xcg = cf * 0.20 * H;                % crude horizontal CG offset
            Mgrav = W * xcg;

            % Total base actions
            Vbase = Fwind;
            Mbase = Mwind + Mgrav;

            sigma = Mbase * c / max(I,eps);     % Pa

            % Wood strength
            sigmaFail = app.woodStrengthGreen.(species);

            % Root-soil resistance
            gammaSoil = soilUnitWeight(app);
            Kroot = rootCoefficient(app);
            Mroot = Kroot * gammaSoil * B * z^3 * 1000;   % convert kN*m-ish expression to N*m

            % Critical winds
            trunkMomentCapacity = sigmaFail * I / max(c,eps);   % N*m
            % remove gravity bias from wind-only available capacity
            trunkWindCapacity = max(trunkMomentCapacity - Mgrav, 0);
            rootWindCapacity = max(Mroot - Mgrav, 0);

            denom = max(app.rho_air * Cd * Aproj * ycp, eps);

            VcritTrunk = sqrt(2*trunkWindCapacity / denom);
            VcritRoot = sqrt(2*rootWindCapacity / denom);
            Vcrit = min(VcritTrunk, VcritRoot);

            % Safety factor using current wind
            if Mwind <= 0
                SF = inf;
            else
                SF = min(trunkWindCapacity, rootWindCapacity) / Mwind;
            end

            if VcritRoot <= VcritTrunk
                failureMode = 'Root uproot governs';
            else
                failureMode = 'Trunk bending governs';
            end

            % Display
            app.BaseShearValue.Value = Vbase/1000;
            app.BaseMomentValue.Value = Mbase/1000;
            app.MaxStressValue.Value = sigma/1e6;
            app.RootMomentValue.Value = Mroot/1000;
            app.TrunkVcritValue.Value = VcritTrunk;
            app.RootVcritValue.Value = VcritRoot;
            app.GoverningVcritValue.Value = Vcrit;
            app.SafetyFactorValue.Value = SF;
            app.FailureModeLabel.Text = failureMode;

            if V < 0.7*Vcrit
                app.StatusLamp.Color = [0 0.7 0];
            elseif V < Vcrit
                app.StatusLamp.Color = [1 0.8 0];
            else
                app.StatusLamp.Color = [0.9 0 0];
            end

            app.LastAnalysis = struct( ...
                'species',species,'rhoWood',rhoWood,'diameter',d,'height',H,'curvature',cf, ...
                'rootWidth',B,'rootDepth',z,'Cd',Cd,'wind',V,'Aproj',Aproj,'Fwind',Fwind, ...
                'Mwind',Mwind,'Mgrav',Mgrav,'Mbase',Mbase,'sigma',sigma,'Mroot',Mroot, ...
                'VcritTrunk',VcritTrunk,'VcritRoot',VcritRoot,'Vcrit',Vcrit,'SF',SF, ...
                'failureMode',failureMode);

            drawTree(app);
            updateNOAARowLabel(app);
            updateMiniSummary(app);
        end

        function gamma = soilUnitWeight(app)
            % kN/m^3 approximate
            switch app.SoilDropDown.Value
                case 'Dry'
                    gamma = 19;
                case 'Normal'
                    gamma = 17;
                case 'Saturated'
                    gamma = 12;
                otherwise
                    gamma = 17;
            end
        end

        function k = rootCoefficient(app)
            rt = app.RootTypeDropDown.Value;
            switch rt
                case 'Plate'
                    kRoot = 2.2;
                case 'Moderate'
                    kRoot = 2.8;
                case 'Fibrous'
                    kRoot = 3.6;
                case 'Taproot'
                    kRoot = 4.2;
                otherwise
                    kRoot = 2.5;
            end

            switch app.SoilDropDown.Value
                case 'Dry'
                    soilFactor = 1.15;
                case 'Normal'
                    soilFactor = 1.00;
                case 'Saturated'
                    soilFactor = 0.60;
                otherwise
                    soilFactor = 1.00;
            end

            k = kRoot * soilFactor;
        end

        function drawTree(app)
            ax = app.Axes;
            cla(ax); hold(ax,'on');

            H = app.HeightField.Value;
            d = app.DiameterField.Value;
            cf = app.CurvatureField.Value;
            V = app.WindSlider.Value;
            Vcrit = app.LastAnalysis.Vcrit;

            n = 150;
            y = linspace(0,H,n);
            xStatic = cf * 0.18 * H * sin((y/H)*pi/2).^1.3;
            bendFactor = min(1.2, V / max(Vcrit, 0.5));
            xWind = 0.10 * H * bendFactor * (y/H).^2;
            x = xStatic + xWind;

            plot(ax,x,y,'LineWidth',max(3, 35*d));

            % stress indicator by trunk color segments
            Mratio = min(1.5, app.LastAnalysis.wind/max(Vcrit,0.1));
            if Mratio < 0.7
                col = [0 0.6 0];
            elseif Mratio < 1.0
                col = [0.9 0.7 0];
            else
                col = [0.85 0 0];
            end
            plot(ax,x,y,'Color',col,'LineWidth',max(3, 35*d));

            % ground line
            plot(ax,[-0.25*H 0.75*H],[0 0],'k-','LineWidth',1.2);

            % root plate
            B = app.RootWidthField.Value;
            z = app.RootDepthField.Value;
            plot(ax,[-B/2 B/2],[-z -z],'k--');
            plot(ax,[-B/2 -B/2],[0 -z],'k--');
            plot(ax,[ B/2  B/2],[0 -z],'k--');

            % wind arrow
            quiver(ax,-0.15*H,0.70*H,0.18*H,0,'LineWidth',2,'MaxHeadSize',2);
            text(ax,-0.15*H,0.75*H,sprintf('Wind = %.1f m/s',V));

            % reaction indicators
            quiver(ax,0,0,-0.08*H,0,'LineWidth',2,'MaxHeadSize',2);
            text(ax,-0.10*H,-0.03*H,'Base reaction');

            title(ax,'Curved Cantilever Tree Model');
            xlabel(ax,'Horizontal distance (m)');
            ylabel(ax,'Vertical distance (m)');
            axis(ax,'equal');
            xlim(ax,[-0.3*H 0.9*H]);
            ylim(ax,[-1.2*max(0.5,z) 1.05*H]);
            grid(ax,'on');
            hold(ax,'off');
        end

        function loadNOAA(app)
            [f,p] = uigetfile({'*.csv','CSV files (*.csv)'},'Select NOAA Storm Events CSV');
            if isequal(f,0), return; end
            T = readtable(fullfile(p,f),'TextType','string');
            app.NOAAData = T;
            updateModel(app);

            app.ReportArea.Value = composeLines( ...
                "NOAA file loaded: " + string(f), ...
                "Rows loaded: " + string(height(T)), ...
                "Next step: click Generate Report.");
        end

        function loadObservations(app)
            [f,p] = uigetfile({'*.csv','CSV files (*.csv)'},'Select local observations CSV');
            if isequal(f,0), return; end
            T = readtable(fullfile(p,f),'TextType','string');
            app.ObsData = T;
            app.ReportArea.Value = composeLines( ...
                "Local observation file loaded: " + string(f), ...
                "Rows loaded: " + string(height(T)));
        end

        function stormReplay(app)
            Vcrit = max(app.LastAnalysis.Vcrit, 1);
            for V = linspace(0, min(1.2*Vcrit, 50), 60)
                app.WindSlider.Value = V;
                updateModel(app);
                pause(0.03);
                drawnow;
            end
        end

        function updateNOAARowLabel(app)
            labels = findobj(app.RightPanel,'Tag','NOAARowsLabel');
            if ~isempty(labels)
                labels(1).Text = num2str(height(app.NOAAData));
            end
        end

        function updateMiniSummary(app)
            A = app.LastAnalysis;
            lines = composeLines( ...
                "Species: " + A.species, ...
                "Current wind: " + sprintf('%.2f m/s (%.1f mph)', A.wind, A.wind*2.23694), ...
                "Governing critical wind: " + sprintf('%.2f m/s (%.1f mph)', A.Vcrit, A.Vcrit*2.23694), ...
                "Failure mode: " + A.failureMode, ...
                "Base moment: " + sprintf('%.2f kN*m', A.Mbase/1000), ...
                "Max bending stress: " + sprintf('%.2f MPa', A.sigma/1e6), ...
                "NOAA rows loaded: " + string(height(app.NOAAData)));
            app.ReportArea.Value = lines;
        end

        function generateReport(app)

            A = app.LastAnalysis;
            eventSummary = summarizeNOAA(app.NOAAData, A.Vcrit);
            obsSummary = summarizeObs(app.ObsData);

            txt = {};
            txt{end+1} = 'TREE STORM DMV ANALYSIS REPORT';
            txt{end+1} = '===========================================';
            txt{end+1} = sprintf('Generated: %s', datestr(now));
            txt{end+1} = ' ';
            txt{end+1} = '1. MODEL SETUP';
            txt{end+1} = sprintf('Species: %s', A.species);
            txt{end+1} = sprintf('Density: %.1f kg/m^3', A.rhoWood);
            txt{end+1} = sprintf('Diameter at base: %.3f m', A.diameter);
            txt{end+1} = sprintf('Height: %.3f m', A.height);
            txt{end+1} = sprintf('Curvature factor: %.3f', A.curvature);
            txt{end+1} = sprintf('Root width: %.3f m', A.rootWidth);
            txt{end+1} = sprintf('Root depth: %.3f m', A.rootDepth);
            txt{end+1} = sprintf('Drag coefficient: %.3f', A.Cd);
            txt{end+1} = sprintf('Current modeled wind: %.3f m/s (%.2f mph)', A.wind, A.wind*2.23694);
            txt{end+1} = ' ';
            txt{end+1} = '2. ENGINEERING RESULTS';
            txt{end+1} = sprintf('Projected area used: %.3f m^2', A.Aproj);
            txt{end+1} = sprintf('Base shear: %.3f kN', A.Fwind/1000);
            txt{end+1} = sprintf('Wind moment: %.3f kN*m', A.Mwind/1000);
            txt{end+1} = sprintf('Gravity moment from curvature: %.3f kN*m', A.Mgrav/1000);
            txt{end+1} = sprintf('Total base moment: %.3f kN*m', A.Mbase/1000);
            txt{end+1} = sprintf('Max bending stress: %.3f MPa', A.sigma/1e6);
            txt{end+1} = sprintf('Root-soil resisting moment: %.3f kN*m', A.Mroot/1000);
            txt{end+1} = sprintf('Critical wind speed, trunk: %.3f m/s (%.2f mph)', A.VcritTrunk, A.VcritTrunk*2.23694);
            txt{end+1} = sprintf('Critical wind speed, roots: %.3f m/s (%.2f mph)', A.VcritRoot, A.VcritRoot*2.23694);
            txt{end+1} = sprintf('Governing critical wind speed: %.3f m/s (%.2f mph)', A.Vcrit, A.Vcrit*2.23694);
            txt{end+1} = sprintf('Predicted governing failure mode: %s', A.failureMode);
            txt{end+1} = sprintf('Safety factor at current wind: %.3f', A.SF);
            txt{end+1} = ' ';
            txt{end+1} = '3. NOAA STORM MATCH';
            txt = [txt, eventSummary(:)'];
            txt{end+1} = ' ';
            txt{end+1} = '4. LOCAL OBSERVATION MATCH';
            txt = [txt, obsSummary(:)'];
            txt{end+1} = ' ';
            txt{end+1} = '5. INTERPRETATION';
            if contains(A.failureMode,'Root')
                txt{end+1} = 'The current configuration is root-governed. This is typical of broad-canopy trees in wet soil where overturning resistance drops before trunk rupture is reached.';
            else
                txt{end+1} = 'The current configuration is trunk-governed. This indicates the section strength is the controlling limit rather than the root-soil anchorage.';
            end

            if contains(app.SeasonDropDown.Value,'Leaf-on')
                txt{end+1} = 'The leaf-on summer setting increases projected area and drag, which tends to lower critical wind speed relative to leaf-off conditions.';
            else
                txt{end+1} = 'The leaf-off setting reduces drag and usually increases critical wind speed relative to summer conditions.';
            end

            switch app.SpeciesDropDown.Value
                case 'Oak'
                    txt{end+1} = 'For oak, the model tends to show higher drag and stronger sensitivity to shallow plate-root anchorage, especially in saturated ground.';
                case 'Maple'
                    txt{end+1} = 'For maple, the model generally predicts moderate drag and a somewhat less severe root-governing response than a broad oak of similar size.';
                case 'Bamboo'
                    txt{end+1} = 'For bamboo, fibrous roots and lower projected drag often shift the system away from catastrophic uprooting and toward large elastic deflection.';
            end

            txt{end+1} = ' ';
            txt{end+1} = '6. LIMITATIONS';
            txt{end+1} = 'This app is a screening-level educational tool. Real tree failure depends on decay, asymmetric crowns, defects, gust dynamics, soil heterogeneity, rainfall history, and stand interactions.';
            txt{end+1} = ' ';
            txt{end+1} = '7. RECOMMENDED NEXT STEPS';
            txt{end+1} = 'Use repeated site measurements, species-specific diameters, and storm-event filtering by county or trail corridor. Compare predicted critical wind speed against observed damaging gusts and the dates of actual failures.';

            app.ReportArea.Value = txt(:);

            defaultName = ['TreeStormDMV_Report_' datestr(now,'yyyymmdd_HHMMSS') '.txt'];
            [f,p] = uiputfile('*.txt','Save report as',defaultName);
            if ~isequal(f,0)
                fid = fopen(fullfile(p,f),'w');
                for i = 1:numel(txt)
                    fprintf(fid,'%s\n',txt{i});
                end
                fclose(fid);
            end
        end

        function lines = summarizeNOAA(app, T, Vcrit)
            lines = {};
            if isempty(T) || height(T)==0
                lines = {'No NOAA data loaded.'};
                return;
            end

            vars = lower(string(T.Properties.VariableNames));

            stateCol = matchVar(vars, ["state"]);
            evtCol   = matchVar(vars, ["event_type"]);
            dateCol  = matchVar(vars, ["begin_date_time","begin_date","begin_yrmonth"]);
            czCol    = matchVar(vars, ["cz_name","county","cz_fips"]);
            magCol   = matchVar(vars, ["magnitude","mag"]);
            magTypeCol = matchVar(vars, ["magnitude_type","magnitude_type_","magtype"]);
            narr1Col = matchVar(vars, ["episode_narrative"]);
            narr2Col = matchVar(vars, ["event_narrative"]);

            TT = T;
            if evtCol ~= ""
                evt = upper(string(TT.(evtCol)));
                keep = contains(evt,'THUNDERSTORM WIND') | contains(evt,'HIGH WIND') | contains(evt,'TORNADO') | contains(evt,'STRONG WIND');
                TT = TT(keep,:);
            end

            if height(TT)==0
                lines = {'NOAA file loaded, but no wind-damage event rows matched the filter.'};
                return;
            end

            wind_ms = nan(height(TT),1);
            if magCol ~= ""
                m = str2double(string(TT.(magCol)));
                wind_ms = m;
                if magTypeCol ~= ""
                    mt = upper(strtrim(string(TT.(magTypeCol))));
                    isKnot = contains(mt,'EG') | contains(mt,'MG') | contains(mt,'KT');
                    isMPH = contains(mt,'MPH');
                    wind_ms(isKnot) = m(isKnot) * 0.514444;
                    wind_ms(isMPH) = m(isMPH) * 0.44704;
                else
                    % assume knots if NOAA estimated gust style data
                    wind_ms = m * 0.514444;
                end
            end

            % Try narrative parsing when magnitude absent
            allNarr = strings(height(TT),1);
            if narr1Col ~= "", allNarr = allNarr + " " + string(TT.(narr1Col)); end
            if narr2Col ~= "", allNarr = allNarr + " " + string(TT.(narr2Col)); end
            for i = 1:height(TT)
                if isnan(wind_ms(i))
                    wind_ms(i) = extractWindFromText(allNarr(i));
                end
            end

            exceed = wind_ms >= Vcrit;
            known = ~isnan(wind_ms);

            lines{end+1} = sprintf('NOAA rows loaded: %d', height(T));
            lines{end+1} = sprintf('Wind-related rows after filtering: %d', height(TT));
            lines{end+1} = sprintf('Rows with usable wind magnitude: %d', nnz(known));
            lines{end+1} = sprintf('Rows meeting or exceeding modeled critical wind speed %.2f m/s: %d', Vcrit, nnz(exceed & known));

            % summarize top events
            [~,idx] = sort(wind_ms,'descend','MissingPlacement','last');
            topN = min(5,height(TT));
            lines{end+1} = 'Top matched events by reported or inferred wind:';
            for k = 1:topN
                i = idx(k);
                dstr = safeGet(TT, dateCol, i, "unknown-date");
                sstr = safeGet(TT, stateCol, i, "unknown-state");
                estr = safeGet(TT, evtCol, i, "unknown-event");
                cstr = safeGet(TT, czCol, i, "unknown-location");
                if isnan(wind_ms(i))
                    wstr = 'wind unavailable';
                else
                    wstr = sprintf('%.2f m/s (%.1f mph)', wind_ms(i), wind_ms(i)*2.23694);
                end
                lines{end+1} = sprintf('  %d) %s | %s | %s | %s | %s', k, string(dstr), string(sstr), string(cstr), string(estr), wstr);
            end
        end

        function lines = summarizeObs(app, T)
            lines = {};
            if isempty(T) || height(T)==0
                lines = {'No local observation file loaded.'};
                return;
            end

            vars = lower(string(T.Properties.VariableNames));
            speciesCol = matchVar(vars, ["species"]);
            dateCol = matchVar(vars, ["date"]);
            trailCol = matchVar(vars, ["trail","location"]);
            fallenCol = matchVar(vars, ["fallencount","count","treesdown"]);
            notesCol = matchVar(vars, ["notes"]);

            lines{end+1} = sprintf('Observation rows loaded: %d', height(T));

            if speciesCol ~= ""
                sp = string(T.(speciesCol));
                [u,~,g] = unique(sp);
                counts = accumarray(g,1);
                for i = 1:numel(u)
                    lines{end+1} = sprintf('  Species %s: %d rows', u(i), counts(i));
                end
            end

            if fallenCol ~= ""
                fc = str2double(string(T.(fallenCol)));
                lines{end+1} = sprintf('  Total fallen/flagged count: %.0f', nansum(fc));
            end

            n = min(3,height(T));
            lines{end+1} = 'Sample observation rows:';
            for i = 1:n
                d = safeGet(T,dateCol,i,"unknown-date");
                tr = safeGet(T,trailCol,i,"unknown-trail");
                sp = safeGet(T,speciesCol,i,"unknown-species");
                nt = safeGet(T,notesCol,i,"");
                lines{end+1} = sprintf('  %d) %s | %s | %s | %s', i, string(d), string(tr), string(sp), string(nt));
            end
        end
    end
end

function out = composeLines(varargin)
out = cellfun(@char, varargin, 'UniformOutput', false);
end

function val = extractWindFromText(txt)
    txt = string(txt);
    val = nan;

    tok = regexp(txt,'(\d+(?:\.\d+)?)\s*(mph)','tokens','once','ignorecase');
    if ~isempty(tok)
        val = str2double(tok{1}) * 0.44704;
        return;
    end

    tok = regexp(txt,'(\d+(?:\.\d+)?)\s*(kt|kts|knot|knots)','tokens','once','ignorecase');
    if ~isempty(tok)
        val = str2double(tok{1}) * 0.514444;
        return;
    end
end

function name = matchVar(varsLower, candidates)
    name = "";
    for j = 1:numel(candidates)
        idx = find(varsLower == lower(candidates(j)),1,'first');
        if ~isempty(idx)
            name = varsLower(idx);
            return;
        end
    end
end

function v = safeGet(T, colName, row, defaultValue)
    if colName == "" || row > height(T)
        v = defaultValue;
        return;
    end
    try
        x = T.(colName);
        if iscell(x)
            v = x{row};
        else
            v = x(row);
        end
        if ismissing(v)
            v = defaultValue;
        end
    catch
        v = defaultValue;
    end
end
