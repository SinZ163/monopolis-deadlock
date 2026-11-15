interface LabelPanel extends Panel {
  html: boolean;
  text: string;
  SetLocString(...args: any[]): any;
  SetAlreadyLocalizedText(...args: any[]): any;
}

interface ImagePanel extends Panel {
  SetImage(...args: any[]): any;
  SetImageFromPanel(...args: any[]): any;
  SetScaling(...args: any[]): any;
  SetImageFromFile(...args: any[]): any;
}

interface TextButtonPanel extends Panel {
  text: string;
}

interface ToggleButtonPanel extends Panel {
  text: string;
  SetSelected(...args: any[]): any;
}

interface DropDownPanel extends Panel {
  AddOption(...args: any[]): any;
  HasOption(...args: any[]): any;
  RemoveOption(...args: any[]): any;
  RemoveAllOptions(...args: any[]): any;
  GetSelected(...args: any[]): any;
  SetSelected(...args: any[]): any;
  SetSelectedIndex(...args: any[]): any;
  FindDropDownMenuChild(...args: any[]): any;
  AccessDropDownMenu(...args: any[]): any;
}

interface TextEntryPanel extends Panel {
  text: string;
  SetMaxChars(...args: any[]): any;
  GetMaxCharCount(...args: any[]): any;
  GetCursorOffset(...args: any[]): any;
  SetCursorOffset(...args: any[]): any;
  ClearSelection(...args: any[]): any;
  SelectAll(...args: any[]): any;
  RaiseChangeEvents(...args: any[]): any;
}

interface CarouselPanel extends Panel {
  SetSelectedChild(...args: any[]): any;
  GetFocusChild(...args: any[]): any;
  GetFocusIndex(...args: any[]): any;
  SetAutoScrollEnabled(...args: any[]): any;
}

interface CircularProgressBarPanel extends Panel {
  max: number;
  min: number;
  value: number;
}

interface CitadelAvatarImagePanel extends Panel {
  accountid: string;
  steamid: string;
  SetAccountID(...args: any[]): any;
}

interface CitadelBindingButtonPanel extends Panel {
  text: string;
}

interface CitadelBlurTargetPanel extends Panel {
  AddBlurPanel(...args: any[]): any;
  RemoveBlurPanel(...args: any[]): any;
}

interface CitadelDamageIndicatorPanel extends Panel {
  ClearJS(...args: any[]): any;
  DrawSoftLinePointsJS(...args: any[]): any;
}

interface CitadelDamageIndicatorOffscreenEnemyPanel extends Panel {
  ClearJS(...args: any[]): any;
  DrawSoftLinePointsJS(...args: any[]): any;
}

interface CitadelFriendPanel extends Panel {
  accountid: string;
  steamid: string;
}

interface CitadelHTMLPanelPanel extends Panel {
  SetURL(...args: any[]): any;
  SetIgnoreCursor(...args: any[]): any;
}

interface CitadelHeroAbilitiesPanel extends Panel {
  heroid: number;
}

interface CitadelHeroBadgePanel extends Panel {
  heroxp: number;
  heroid: number;
}

interface CitadelHeroBadgeIconPanel extends Panel {
  heroxp: number;
  heroid: number;
}

interface CitadelHeroBadgeSmallPanel extends Panel {
  heroxp: number;
  heroid: number;
}

interface CitadelHeroImagePanel extends Panel {
  SetImage(...args: any[]): any;
  SetImageFromPanel(...args: any[]): any;
  SetScaling(...args: any[]): any;
  SetImageFromFile(...args: any[]): any;
  SetHeroID(...args: any[]): any;
}

interface CitadelHeroLogoPanel extends Panel {
  heroid: number;
}

interface CitadelHeroScenePanelNewPanel extends Panel {
  heroid: number;
  FireEntityInput(...args: any[]): any;
  PlayEntitySoundEvent(...args: any[]): any;
  SetCustomPostProcessMaterial(...args: any[]): any;
  LerpToCameraEntity(...args: any[]): any;
  SetAG2ControlParameterSymbol(...args: any[]): any;
  SetAG2ControlParameterBool(...args: any[]): any;
}

interface CitadelHeroTagsPanel extends Panel {
  heroid: number;
}

interface CitadelObjectivesMapPanel extends Panel {
  SetObjectivesMask(...args: any[]): any;
}

interface CitadelObjectivesTooltipPanel extends Panel {
  GetTooltipTarget(...args: any[]): any;
}

interface CitadelPostGameProgressHeroReleaseVoteResultsPanel extends Panel {
  NotifyFinishedAnimating(...args: any[]): any;
}

interface CitadelPostGameProgressLocalPlayerPanel extends Panel {
  NotifyFinishedAnimating(...args: any[]): any;
}

interface CitadelPostGameProgressMVPPanel extends Panel {
  NotifyFinishedAnimating(...args: any[]): any;
}

interface CitadelPostGameProgressRankedPanel extends Panel {
  NotifyFinishedAnimating(...args: any[]): any;
  PlayRankRevealMusic(...args: any[]): any;
  GetProgressRankInfo(...args: any[]): any;
}

interface CitadelProfileCardPanel extends Panel {
  accountid: string;
  steamid: string;
}

interface CitadelRankedBadgePanel extends Panel {
  subRank: number;
  rank: number;
  packedRank: string;
}

interface CitadelRankedBadgeChalkPanel extends Panel {
  subRank: number;
  rank: number;
  packedRank: string;
}

interface CitadelRankedBadgeFullPanel extends Panel {
  subRank: number;
  rank: number;
  packedRank: string;
}

interface CitadelRankedBadgeMiniPanel extends Panel {
  subRank: number;
  rank: number;
  packedRank: string;
}

interface CitadelScenePanelPanel extends Panel {
  FireEntityInput(...args: any[]): any;
  PlayEntitySoundEvent(...args: any[]): any;
  SetCustomPostProcessMaterial(...args: any[]): any;
  LerpToCameraEntity(...args: any[]): any;
  SetAG2ControlParameterSymbol(...args: any[]): any;
  SetAG2ControlParameterBool(...args: any[]): any;
}

interface CitadelSettingsCheckboxPanel extends Panel {
  text: string;
  SetSelected(...args: any[]): any;
}

interface CitadelSettingsSliderPanel extends Panel {
  max: number;
  min: number;
  value: number;
}

interface CitadelSettingsTogglePanel extends Panel {
  text: string;
  SetSelected(...args: any[]): any;
}

interface CitadelUserNamePanel extends Panel {
  accountid: string;
  steamid: string;
  SetPlayerOrBot(...args: any[]): any;
}

interface CitadelUserRichPresencePanel extends Panel {
  accountid: string;
  steamid: string;
}

interface CountdownPanel extends Panel {
  timeDialogVariable: string;
  updateInterval: number;
  endTime: string;
  startTime: string;
}

interface EconItemImagePanel extends Panel {
  SetImage(...args: any[]): any;
  SetImageFromPanel(...args: any[]): any;
  SetScaling(...args: any[]): any;
  SetImageFromFile(...args: any[]): any;
}

interface MoviePanel extends Panel {
  SetMovie(...args: any[]): any;
  SetCaptions(...args: any[]): any;
  SetControls(...args: any[]): any;
  SetTitle(...args: any[]): any;
  Play(...args: any[]): any;
  Pause(...args: any[]): any;
  Stop(...args: any[]): any;
  SetRepeat(...args: any[]): any;
  SetPlaybackVolume(...args: any[]): any;
  BAdjustingVolume(...args: any[]): any;
  UseAttachedAudioStream(...args: any[]): any;
}

interface MovieCaptionsPanel extends Panel {
  movieTime: number;
}

interface NumberEntryPanel extends Panel {
  increment: number;
  max: number;
  min: number;
  value: number;
}

interface ParticleScenePanelPanel extends Panel {
  FireEntityInput(...args: any[]): any;
  PlayEntitySoundEvent(...args: any[]): any;
  SetCustomPostProcessMaterial(...args: any[]): any;
  LerpToCameraEntity(...args: any[]): any;
  SetAG2ControlParameterSymbol(...args: any[]): any;
  SetAG2ControlParameterBool(...args: any[]): any;
  StartParticles(...args: any[]): any;
  StopParticlesImmediately(...args: any[]): any;
  StopParticlesWithEndcaps(...args: any[]): any;
}

interface ProgressBarPanel extends Panel {
  valuePerNotch: number;
  hasNotches: boolean;
  max: number;
  min: number;
  value: number;
}

interface ProgressBarWithMiddlePanel extends Panel {
  max: number;
  min: number;
  uppervalue: number;
  lowervalue: number;
}

interface RadioButtonPanel extends Panel {
  group: string;
  GetSelectedButton(...args: any[]): any;
}

interface SliderPanel extends Panel {
  mousedown: boolean;
  default: number;
  increment: number;
  max: number;
  min: number;
  value: number;
  SetDirection(...args: any[]): any;
  SetShowDefaultValue(...args: any[]): any;
  SetRequiresSelection(...args: any[]): any;
  SetValueNoEvents(...args: any[]): any;
}

interface SlottedSliderPanel extends Panel {
  mousedown: boolean;
  default: number;
  increment: number;
  max: number;
  min: number;
  value: number;
  SetDirection(...args: any[]): any;
  SetShowDefaultValue(...args: any[]): any;
  SetRequiresSelection(...args: any[]): any;
  SetValueNoEvents(...args: any[]): any;
}

interface SyncedFontSizeLabelPanel extends Panel {
  fontsizesyncgroup: string;
  html: boolean;
  text: string;
  SetLocString(...args: any[]): any;
  SetAlreadyLocalizedText(...args: any[]): any;
}

interface TooltipContentsPanel extends Panel {
  GetTooltipTarget(...args: any[]): any;
}

interface UICanvasPanel extends Panel {
  ClearJS(...args: any[]): any;
  DrawSoftLinePointsJS(...args: any[]): any;
}

interface CitadelHeroBadgeProgressPanel extends Panel {
  progressheroxp: number;
  heroxp: number;
  heroid: number;
}

interface CitadelProgressBarDeltaPanel extends Panel {
  GetTooltipTarget(...args: any[]): any;
}

interface CitadelTooltipModBonusDisplayPanel extends Panel {
  GetTooltipTarget(...args: any[]): any;
}

interface CitadelUITextTooltipPanel extends Panel {
  GetTooltipTarget(...args: any[]): any;
}

interface HTMLPanel extends Panel {
  SetURL(...args: any[]): any;
  SetIgnoreCursor(...args: any[]): any;
}

interface PanoramaPanelNameMap {
  Panel: Panel;
  Label: LabelPanel;
  Image: ImagePanel;
  TextButton: TextButtonPanel;
  ToggleButton: ToggleButtonPanel;
  DropDown: DropDownPanel;
  TextEntry: TextEntryPanel;
  Carousel: CarouselPanel;
  CircularProgressBar: CircularProgressBarPanel;
  CitadelAvatarImage: CitadelAvatarImagePanel;
  CitadelBindingButton: CitadelBindingButtonPanel;
  CitadelBlurTarget: CitadelBlurTargetPanel;
  CitadelDamageIndicator: CitadelDamageIndicatorPanel;
  CitadelDamageIndicatorOffscreenEnemy: CitadelDamageIndicatorOffscreenEnemyPanel;
  CitadelFriend: CitadelFriendPanel;
  CitadelHTMLPanel: CitadelHTMLPanelPanel;
  CitadelHeroAbilities: CitadelHeroAbilitiesPanel;
  CitadelHeroBadge: CitadelHeroBadgePanel;
  CitadelHeroBadgeIcon: CitadelHeroBadgeIconPanel;
  CitadelHeroBadgeSmall: CitadelHeroBadgeSmallPanel;
  CitadelHeroImage: CitadelHeroImagePanel;
  CitadelHeroLogo: CitadelHeroLogoPanel;
  CitadelHeroScenePanelNew: CitadelHeroScenePanelNewPanel;
  CitadelHeroTags: CitadelHeroTagsPanel;
  CitadelObjectivesMap: CitadelObjectivesMapPanel;
  CitadelObjectivesTooltip: CitadelObjectivesTooltipPanel;
  CitadelPostGameProgressHeroReleaseVoteResults: CitadelPostGameProgressHeroReleaseVoteResultsPanel;
  CitadelPostGameProgressLocalPlayer: CitadelPostGameProgressLocalPlayerPanel;
  CitadelPostGameProgressMVP: CitadelPostGameProgressMVPPanel;
  CitadelPostGameProgressRanked: CitadelPostGameProgressRankedPanel;
  CitadelProfileCard: CitadelProfileCardPanel;
  CitadelRankedBadge: CitadelRankedBadgePanel;
  CitadelRankedBadgeChalk: CitadelRankedBadgeChalkPanel;
  CitadelRankedBadgeFull: CitadelRankedBadgeFullPanel;
  CitadelRankedBadgeMini: CitadelRankedBadgeMiniPanel;
  CitadelScenePanel: CitadelScenePanelPanel;
  CitadelSettingsCheckbox: CitadelSettingsCheckboxPanel;
  CitadelSettingsSlider: CitadelSettingsSliderPanel;
  CitadelSettingsToggle: CitadelSettingsTogglePanel;
  CitadelUserName: CitadelUserNamePanel;
  CitadelUserRichPresence: CitadelUserRichPresencePanel;
  Countdown: CountdownPanel;
  EconItemImage: EconItemImagePanel;
  Movie: MoviePanel;
  MovieCaptions: MovieCaptionsPanel;
  NumberEntry: NumberEntryPanel;
  ParticleScenePanel: ParticleScenePanelPanel;
  ProgressBar: ProgressBarPanel;
  ProgressBarWithMiddle: ProgressBarWithMiddlePanel;
  RadioButton: RadioButtonPanel;
  Slider: SliderPanel;
  SlottedSlider: SlottedSliderPanel;
  SyncedFontSizeLabel: SyncedFontSizeLabelPanel;
  TooltipContents: TooltipContentsPanel;
  UICanvas: UICanvasPanel;
  CitadelHeroBadgeProgress: CitadelHeroBadgeProgressPanel;
  CitadelProgressBarDelta: CitadelProgressBarDeltaPanel;
  CitadelTooltipModBonusDisplay: CitadelTooltipModBonusDisplayPanel;
  CitadelUITextTooltip: CitadelUITextTooltipPanel;
  HTML: HTMLPanel;
}
