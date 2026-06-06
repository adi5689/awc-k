// ============================================================
// SMART ANGANWADI - TRANSLATIONS (EN / OD)
// ============================================================

export type TranslationKey =
  | 'nav.settings'
  | 'nav.logout'
  | 'nav.dashboard'
  | 'nav.children'
  | 'nav.learning'
  | 'nav.nutrition'
  | 'nav.parents'
  | 'nav.board'
  | 'nav.insights'
  | 'nav.overview'
  | 'nav.awc_list'
  | 'nav.analytics'
  | 'nav.district'
  | 'nav.heatmap'
  | 'nav.reports'
  | 'header.title'
  | 'header.subtitle'
  | 'header.online'
  | 'header.offline'
  | 'header.pending'
  | 'header.synced'
  | 'header.notifications'
  | 'header.mark_all_read'
  | 'header.no_notifications'
  | 'header.theme_light'
  | 'header.theme_dark'
  | 'role.worker'
  | 'role.supervisor'
  | 'role.admin'
  | 'role.logged_in_as'
  | 'growth_dashboard'
  | 'physical_growth'
  | 'attendance_consistency'
  | 'school_readiness'
  | 'growth_note'
  | 'attendance_note'
  | 'readiness_note'
  | 'smart_insights'
  | 'assessment_progress'
  | 'holistic_view'
  | 'cognitive'
  | 'language'
  | 'physical'
  | 'social'
  | 'creativity'
  | 'home_activities'
  | 'no_report'
  | 'badges_meal_log'
  | 'back_to_children'
  | 'open_parent_report'
  | 'child_not_found'
  | 'district_dashboard'
  | 'district_analytics'
  | 'district_subtitle'
  | 'ai_powered'
  | 'total_awcs'
  | 'total_children'
  | 'learning_improvement'
  | 'malnutrition_reduction'
  | 'avg_attendance'
  | 'active_alerts'
  | 'block_performance'
  | 'six_month_trend'
  | 'heatmap'
  | 'performance_label'
  | 'good'
  | 'average'
  | 'poor'
  | 'supervisor_dashboard'
  | 'supervisor_subtitle'
  | 'awc_performance_list'
  | 'center_name'
  | 'sector'
  | 'status'
  | 'awcs'
  | 'children'
  | 'manage_awc'
  | 'pencil'
  | 'eraser'
  | 'text_tool'
  | 'shape'
  | 'stamp'
  | 'undo'
  | 'redo'
  | 'clear'
  | 'download'
  | 'save'
  | 'black_board'
  | 'white_board'
  | 'green_board'
  | 'graph_paper'
  | 'ruled_paper'
  | 'dotted_grid'
  | 'choose_board'
  | 'select_tracing'
  | 'enter_text'
  | 'page'
  | 'letters'
  | 'numbers'
  | 'shapes'
  | 'boy'
  | 'girl'
  | 'parent_label'
  | 'attendance.scanner_title'
  | 'attendance.scanning'
  | 'attendance.hold_steady'
  | 'attendance.scan_complete'
  | 'attendance.scan_summary'
  | 'attendance.present'
  | 'attendance.absent'
  | 'attendance.processing'
  | 'attendance.submit_count'
  | 'dashboard.title'
  | 'dashboard.subtitle'
  | 'dashboard.enrolled'
  | 'dashboard.avg_learning'
  | 'dashboard.attendance'
  | 'dashboard.nutrition_alerts'
  | 'dashboard.learning_journey'
  | 'dashboard.child_development'
  | 'dashboard.quick_assessment'
  | 'dashboard.radar_chart'
  | 'dashboard.theme_current'
  | 'dashboard.stars_earned'
  | 'dashboard.offline_packs'
  | 'dashboard.hero.badge'
  | 'dashboard.hero.title'
  | 'dashboard.hero.desc'
  | 'dashboard.hero.btn_learning'
  | 'dashboard.hero.btn_nutrition'
  | 'dashboard.stats.sync_status'
  | 'dashboard.stats.online'
  | 'dashboard.stats.offline'
  | 'dashboard.stats.sync_ready'
  | 'dashboard.stats.sync_queue'
  | 'dashboard.stats.activities_meta'
  | 'dashboard.stats.offline_meta'
  | 'dashboard.learning.title'
  | 'dashboard.learning.desc'
  | 'dashboard.learning.btn'
  | 'dashboard.development.title'
  | 'dashboard.development.desc'
  | 'dashboard.development.btn'
  | 'dashboard.assessment.title'
  | 'dashboard.assessment.desc'
  | 'dashboard.radar.title'
  | 'dashboard.radar.desc'
  | 'dashboard.actions.title'
  | 'dashboard.actions.notifications'
  | 'dashboard.actions.meals'
  | 'dashboard.actions.badges'
  | 'dashboard.actions.download'
  | 'dashboard.actions.mark_attendance'
  | 'dashboard.charts.attendance_trend'
  | 'dashboard.charts.nutrition_distribution'
  | 'dashboard.charts.learning_summary'
  | 'dashboard.insights.center_alerts'
  | 'dashboard.stats.present_today'
  | 'children.actions.register'
  | 'children.actions.quick_assessment'
  | 'children.filter.risk_only'
  | 'children.stats.total'
  | 'children.stats.malnourished'
  | 'children.stats.attendance'
  | 'children.title'
  | 'children.subtitle'
  | 'children.search_placeholder'
  | 'children.no_results'
  | 'children.batch_beginner'
  | 'children.batch_intermediate'
  | 'children.batch_advanced'
  | 'children.count_single'
  | 'children.count_multiple'
  | 'domain.cognitive'
  | 'domain.language'
  | 'domain.physical'
  | 'domain.social'
  | 'domain.creativity'
  | 'domain.nutrition'
  | 'units.cm'
  | 'units.kg'
  | 'units.mm'
  | 'dashboard.assessment.autosave'
  | 'dashboard.stats.theme_meta'
  | 'dashboard.stats.current_theme'
  | 'status.verb_need'
  | 'status.verb_needs'
  | 'insights.ai_title'
  | 'insights.ai_subtitle'
  | 'insights.sam_critical'
  | 'insights.sam_message'
  | 'insights.attendance_warning'
  | 'insights.attendance_message'
  | 'insights.learning_warning'
  | 'insights.learning_message'
  | 'insights.assessment_reminder'
  | 'insights.assessment_desc'
  | 'insights.progress_success'
  | 'insights.progress_message'
  | 'insights.action.nrc'
  | 'insights.action.visits'
  | 'insights.action.easy'
  | 'insights.action.assessment'
  | 'insights.action.profile'
  | 'common.app_name'
  | 'common.app_subtitle'
  | 'common.confirm'
  | 'common.cancel'
  | 'common.submit'
  | 'common.save'
  | 'common.search'
  | 'common.view_all'
  | 'common.at_risk'
  | 'common.healthy'
  | 'common.monitor'
  | 'common.needs_attention'
  | 'common.developing'
  | 'common.on_track'
  | 'common.saved'
  | 'common.height'
  | 'common.weight'
  | 'common.muac'
  | 'common.physical_growth'
  | 'common.yes'
  | 'common.no'
  | 'common.needs_help'
  | 'common.parent_label'
  | 'common.back'
  | 'common.tag.counting'
  | 'common.tag.matching'
  | 'common.tag.focus'
  | 'common.tag.listening'
  | 'common.tag.speaking'
  | 'common.tag.vocabulary'
  | 'common.tag.balance'
  | 'common.tag.coordination'
  | 'common.tag.confidence'
  | 'common.tag.expression'
  | 'common.tag.fine_motor'
  | 'common.tag.identity'
  | 'common.tag.food_awareness'
  | 'common.tag.decision_making'
  | 'data.activity.match.instructions'
  | 'data.activity.story.instructions'
  | 'data.activity.physical.instructions'
  | 'data.activity.draw.instructions'
  | 'data.activity.nutrition.instructions'
  | 'data.activity.match.title'
  | 'data.activity.story.title'
  | 'data.activity.physical.title'
  | 'data.activity.draw.title'
  | 'data.activity.nutrition.title'
  | 'status.normal'
  | 'status.mam'
  | 'status.sam'
  | 'status.boy'
  | 'status.girl'
  | 'status.stunted'
  | 'status.underweight'
  | 'status.low_attendance'
  | 'status.wasted'
  | 'status.healthy'
  | 'status.monitor'
  | 'status.attention_needed'
  | 'status.severely_underweight'
  | 'status.severely_stunted'
  | 'status.severely_wasted'
  | 'status.months'
  | 'status.years'
  | 'status.yr'
  | 'status.mo'
  | 'status.just_now'
  | 'status.min_ago'
  | 'status.hr_ago'
  | 'status.day_ago'
  | 'status.good'
  | 'status.warning'
  | 'status.critical'
  | 'data.persona.fast_learner'
  | 'data.persona.visual_learner'
  | 'data.persona.curious_explorer'
  | 'data.persona.social_butterfly'
  | 'data.persona.creative_thinker'
  | 'data.persona.needs_support'
  | 'data.insight.on_track.title'
  | 'data.insight.on_track.detail'
  | 'data.insight.needs_improvement.title'
  | 'data.insight.needs_improvement.detail'
  | 'data.insight.immediate_support.title'
  | 'data.insight.immediate_support.detail'
  | 'data.insight.recovering.title'
  | 'data.insight.recovering.detail'
  | 'data.insight.intervention.title'
  | 'data.insight.intervention.detail'
  | 'data.insight.attendance.title'
  | 'data.insight.attendance.detail'
  | 'data.meal.suji_upma'
  | 'data.meal.rice_dalma'
  | 'data.meal.khichdi'
  | 'data.notification.growth_audit.title'
  | 'data.notification.growth_audit.msg'
  | 'data.notification.policy_update.title'
  | 'data.notification.policy_update.msg'
  | 'data.report.week_label'
  | 'data.report.summary_c1'
  | 'data.report.highlight.roles'
  | 'data.report.highlight.counting'
  | 'data.report.highlight.motor'
  | 'data.report.suggested_home'
  | 'data.insight.avg_attendance'
  | 'data.insight.malnutrition_level'
  | 'data.insight.learning_scores'
  | 'data.insight.sync_status'
  | 'data.badge.star_helper.title'
  | 'data.badge.star_helper.description'
  | 'data.theme.family'
  | 'data.theme.animals'
  | 'data.theme.seasons'
  | 'data.theme.helpers'
  | 'data.theme.nature'
  | 'data.badge.learner.title'
  | 'data.badge.learner.desc'
  | 'data.badge.communicator.title'
  | 'data.badge.communicator.desc'
  | 'data.badge.nutrition.title'
  | 'data.badge.nutrition.desc'
  | 'learning.hero.badge'
  | 'learning.hero.title'
  | 'learning.hero.desc'
  | 'learning.stats.theme_active'
  | 'learning.stats.modules'
  | 'learning.stats.videos'
  | 'learning.stats.autosave'
  | 'learning.theme.title'
  | 'learning.theme.desc'
  | 'learning.modules.title'
  | 'learning.modules.desc'
  | 'learning.modules.start'
  | 'learning.modules.flow'
  | 'learning.modules.tasks'
  | 'learning.activity.title'
  | 'learning.activity.desc'
  | 'learning.activity.detail'
  | 'learning.activity.mins'
  | 'learning.shapes.title'
  | 'learning.shapes.desc'
  | 'learning.shapes.concept'
  | 'learning.shapes.minitask'
  | 'learning.videos.title'
  | 'learning.videos.desc'
  | 'learning.videos.goals'
  | 'learning.videos.prompts'
  | 'progress.attendance'
  | 'progress.nutrition'
  | 'progress.learning'
  | 'board.chalk_board'
  | 'board.tool.pen'
  | 'board.tool.highlighter'
  | 'board.tool.eraser'
  | 'board.tool.shapes'
  | 'board.tool.text'
  | 'board.tool.stamps'
  | 'board.tool.tracing'
  | 'board.tool.tools'
  | 'board.tool.size'
  | 'board.tool.color'
  | 'board.tool.theme'
  | 'board.new_page'
  | 'board.fullscreen'
  | 'board.exit_fullscreen'
  | 'board.stamps.reward'
  | 'board.tracing.guide'
  | 'board.teaching_tools'
  | 'board.timer'
  | 'board.dice'
  | 'board.random_student'
  | 'board.color.black'
  | 'board.color.white'
  | 'board.color.yellow'
  | 'board.color.pink'
  | 'board.color.blue'
  | 'board.color.orange'
  | 'board.color.lime'
  | 'board.color.red'
  | 'board.color.violet'
  | 'board.tracing.odia_vowels'
  | 'board.tracing.odia_consonants'
  | 'board.tracing.hindi_vowels'
  | 'board.tracing.hindi_consonants'
  | 'board.tracing.english_upper'
  | 'board.tracing.english_lower'
  | 'board.tracing.numbers'
  | 'board.tracing.shapes'
  | 'board.tracing.patterns'
  | 'board.stamps.star'
  | 'board.stamps.correct'
  | 'board.stamps.love'
  | 'board.stamps.good'
  | 'board.stamps.happy'
  | 'board.stamps.winner'
  | 'admin.district_dashboard'
  | 'admin.block_performance'
  | 'admin.trend_6month'
  | 'admin.heatmap_title'
  | 'admin.learning_improvement'
  | 'admin.malnutrition_reduction'
  | 'admin.nutrition_risk'
  | 'supervisor.dashboard_title'
  | 'supervisor.block_overview'
  | 'supervisor.total_children'
  | 'supervisor.nutrition_risk'
  | 'supervisor.avg_learning'
  | 'supervisor.critical_cases'
  | 'supervisor.awc_performance'
  | 'supervisor.nutrition_categories'
  | 'supervisor.all_clear'
  | 'supervisor.alerts_count'
  | 'supervisor.awc_detail'
  | 'supervisor.active_alerts'
  | 'supervisor.present_today'
  | 'supervisor.enrolled_count'
  | 'supervisor.kpi.total_children'
  | 'supervisor.kpi.nutrition_risk'
  | 'supervisor.kpi.avg_learning'
  | 'supervisor.kpi.critical_cases'
  | 'supervisor.kpi.present_today'
  | 'supervisor.kpi.nutrition_sub'
  | 'supervisor.chart.awc_performance'
  | 'supervisor.chart.learning'
  | 'supervisor.chart.attendance'
  | 'supervisor.chart.nutrition_categories'
  | 'supervisor.table.title'
  | 'supervisor.table.centre_name'
  | 'supervisor.table.worker'
  | 'supervisor.table.status'
  | 'supervisor.table.children'
  | 'supervisor.table.learning'
  | 'supervisor.table.attendance'
  | 'supervisor.table.alerts'
  | 'supervisor.table.all_clear'
  | 'supervisor.table.alerts_count'
  | 'awc_detail.not_found'
  | 'awc_detail.back'
  | 'awc_detail.active_alerts'
  | 'awc_detail.present_today'
  | 'awc_detail.avg_learning'
  | 'awc_detail.attendance_rate'
  | 'awc_detail.critical_cases'
  | 'awc_detail.nutrition_breakdown'
  | 'awc_detail.children_enrolled'
  | 'awc_detail.table.name'
  | 'awc_detail.table.age'
  | 'awc_detail.table.learning'
  | 'awc_detail.table.nutrition'
  | 'awc_detail.table.attendance'
  | 'awc_detail.table.risk'
  | 'district.dashboard_title'
  | 'district.subtitle'
  | 'district.ai_analytics'
  | 'district.kpi.total_awcs'
  | 'district.kpi.total_children'
  | 'district.kpi.learning_improvement'
  | 'district.kpi.malnutrition_reduction'
  | 'district.kpi.avg_attendance'
  | 'district.kpi.active_alerts'
  | 'district.kpi.sub_improvement'
  | 'district.kpi.sub_reduction'
  | 'district.chart.block_performance'
  | 'district.chart.trend_6months'
  | 'district.chart.avg_learning'
  | 'district.chart.nutrition_risk'
  | 'district.heatmap.title'
  | 'district.heatmap.awcs'
  | 'district.heatmap.children'
  | 'district.heatmap.learning'
  | 'district.heatmap.nutrition_risk'
  | 'district.heatmap.performance_legend'
  | 'district.insights.title'
  | 'district.insights.take_action'
  | 'district.insights.critical_malnutrition_title'
  | 'district.insights.critical_malnutrition_msg'
  | 'district.insights.kanjiaguda_intervention_title'
  | 'district.insights.kanjiaguda_intervention_msg'
  | 'district.insights.beguniapada_learning_title'
  | 'district.insights.beguniapada_learning_msg'
  | 'district.insights.ganjam_success_title'
  | 'district.insights.ganjam_success_msg'
  | 'district.insights.monsoon_advisory_title'
  | 'district.insights.monsoon_advisory_msg'
  | 'district.insights.sorada_sam_cluster_title'
  | 'district.insights.sorada_sam_cluster_msg'
  | 'risk.low'
  | 'risk.medium'
  | 'risk.high'
  | 'months.jan'
  | 'months.feb'
  | 'months.mar'
  | 'months.apr'
  | 'months.may'
  | 'months.jun'
  | 'months.jul'
  | 'months.aug'
  | 'months.sep'
  | 'months.oct'
  | 'months.nov'
  | 'months.dec';

export const translations: Record<'en' | 'od', Record<string, string>> = {
  en: {
    // Nav
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',
    'nav.dashboard': 'Dashboard',
    'nav.children': 'Children',
    'nav.learning': 'Learning Journey',
    'nav.nutrition': 'Health & Nutrition',
    'nav.parents': 'Parent Reports',
    'nav.board': 'Digital Board',
    'nav.insights': 'AI Insights',
    'nav.overview': 'Overview',
    'nav.awc_list': 'AWC List',
    'nav.analytics': 'Analytics',
    'nav.district': 'District Dashboard',
    'nav.heatmap': 'Heatmap',
    'nav.reports': 'Reports',
    'nav.group.dashboard': 'Dashboard',
    'nav.group.children': 'Children',
    'nav.group.learning': 'Learning',
    'nav.group.nutrition_health': 'Nutrition & Health',
    'nav.group.attendance': 'Attendance',
    'nav.group.interventions': 'Interventions',
    'nav.group.reports': 'Reports',
    'nav.group.offline_sync': 'Offline Sync',
    'nav.group.overview': 'Overview',
    'nav.group.monitoring': 'Monitoring',
    'nav.group.health_stats': 'Health & Stats',
    'nav.group.analytics_reports': 'Analytics & Reports',
    'nav.all_children': 'All Children',
    'nav.progress_tracking': 'Progress Tracking',
    'nav.learning_progress': 'Learning Progress',
    'nav.learning_session': 'Learning Session',
    'nav.adaptive_learning': 'Adaptive Learning',
    'nav.whiteboard': 'Whiteboard',
    'nav.nutrition_status': 'Nutrition Status',
    'nav.predictive_risk': 'Predictive Risk',
    'nav.immunization': 'Immunization',
    'nav.daily_attendance': 'Daily Attendance',
    'nav.critical_alerts': 'Critical Alerts',
    'nav.ai_dashboard': 'AI Dashboard',
    'nav.suggested_actions': 'Suggested Actions',
    'nav.training': 'Training',
    'nav.offline_sync': 'Offline Sync',
    'nav.centres_directory': 'Centres Directory',
    'nav.attendance_trends': 'Attendance Trends',
    'nav.educational_progress': 'Educational Progress',
    'nav.nutrition_tracking': 'Nutrition Tracking',
    'nav.immunization_coverage': 'Immunization Coverage',
    'nav.generate_reports': 'Generate Reports',
    'nav.training_progress': 'Training Progress',
    'nav.system_monitoring': 'System Monitoring',
    'nav.integrations': 'Integrations',
    'language.english': 'English',
    'language.odia': 'Odia',
    'common.district_suffix': 'District',

    // Header
    'header.title': 'Smart Anganwadi',
    'header.subtitle': 'ICDS Operations, Child Development & Parent Engagement',
    'header.online': 'Online',
    'header.offline': 'Offline',
    'header.pending': 'Pending',
    'header.synced': 'Synced',
    'header.notifications': 'Notifications',
    'header.mark_all_read': 'Mark all as read',
    'header.no_notifications': 'No notifications',
    'header.theme_light': 'Switch to light mode',
    'header.theme_dark': 'Switch to dark mode',

    // Roles
    'role.worker': 'Anganwadi Worker',
    'role.supervisor': 'Supervisor',
    'role.admin': 'Administrator',
    'role.logged_in_as': 'Logged in as',

    // Legacy/Generic Keys (being migrated to namespaced)
    growth_dashboard: 'Growth Dashboard',
    physical_growth: 'Physical growth',
    attendance_consistency: 'Attendance consistency',
    school_readiness: 'School readiness',
    growth_note: 'Weight, height, and participation trend',
    attendance_note: 'Useful predictor for continuity of care',
    readiness_note: 'Combined learning and routine score',
    smart_insights: 'Smart Insights Panel',
    assessment_progress: 'Assessment & Progress',
    holistic_view: 'Holistic view across five developmental domains.',
    cognitive: 'Cognitive',
    language: 'Language',
    physical: 'Physical',
    social: 'Social',
    creativity: 'Creativity',
    home_activities: 'Home Activities',
    no_report: 'Weekly report not available yet.',
    badges_meal_log: 'Badges & Meal Log',
    back_to_children: 'Back to Children',
    open_parent_report: 'Open Parent Report',
    child_not_found: 'Child not found.',
    district_dashboard: 'District Dashboard',
    district_analytics: 'District-wide Analytics',
    district_subtitle: 'Kalahandi District · ICDS, Odisha - District-wide Analytics',
    ai_powered: 'AI-Powered Analytics',
    total_awcs: 'Total AWCs',
    total_children: 'Total Children',
    learning_improvement: 'Learning ↑',
    malnutrition_reduction: 'Malnutrition ↓',
    avg_attendance: 'Avg Attendance',
    active_alerts: 'Active Alerts',
    block_performance: 'Block-wise Performance',
    six_month_trend: '6-Month Trend',
    heatmap: 'Block-wise Performance Heatmap',
    performance_label: 'Performance:',
    good: 'Good',
    average: 'Average',
    poor: 'Poor',
    supervisor_dashboard: 'Supervisor Dashboard',
    supervisor_subtitle: 'Center-wise monitoring and daily stats.',
    awc_performance_list: 'AWC Performance List',
    center_name: 'Center Name',
    sector: 'Sector',
    status: 'Status',
    awcs: 'AWCs',
    children: 'Children',
    manage_awc: 'Manage AWC',
    pencil: 'Pencil',
    eraser: 'Eraser',
    text_tool: 'Text',
    shape: 'Shape',
    stamp: 'Stamp',
    undo: 'Undo',
    redo: 'Redo',
    clear: 'Clear',
    download: 'Download',
    save: 'Save',
    black_board: 'Black Board',
    white_board: 'White Board',
    green_board: 'Green Board',
    graph_paper: 'Graph Paper',
    ruled_paper: 'Ruled Paper',
    dotted_grid: 'Dotted Grid',
    choose_board: 'Choose a board type',
    select_tracing: 'Select a tracing guide',
    enter_text: 'Enter text:',
    page: 'Page',
    letters: 'Letters',
    numbers: 'Numbers',
    shapes: 'Shapes',
    boy: 'Boy',
    girl: 'Girl',
    parent_label: 'Parent: ',

    // Core Domain Namespaces
    'domain.cognitive': 'Cognitive',
    'domain.language': 'Language',
    'domain.physical': 'Physical',
    'domain.social': 'Social',
    'domain.creativity': 'Creativity',
    'domain.nutrition': 'Nutrition',

    // Unit Namespaces
    'units.cm': 'cm',
    'units.kg': 'kg',
    'units.mm': 'mm',

    // Common Action Namespaces
    'common.app_name': 'Smart Anganwadi',
    'common.app_subtitle': 'ICDS + NEP 2020 Learning OS',
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.save': 'Save',
    'common.search': 'Search',
    'common.view_all': 'View All',
    'common.at_risk': 'At Risk',
    'common.healthy': 'Healthy',
    'common.monitor': 'Monitor',
    'common.needs_attention': 'Needs Attention',
    'common.developing': 'Developing',
    'common.on_track': 'On Track',
    'common.saved': 'Saved',
    'common.height': 'Height',
    'common.weight': 'Weight',
    'common.muac': 'MUAC',
    'common.physical_growth': 'Physical Growth',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.needs_help': 'Needs Help',
    'common.parent_label': 'Parent: ',
    'common.back': 'Back',
    'common.tag.counting': 'Counting',
    'common.tag.matching': 'Matching',
    'common.tag.focus': 'Focus',
    'common.tag.listening': 'Listening',
    'common.tag.speaking': 'Speaking',
    'common.tag.vocabulary': 'Vocabulary',
    'common.tag.balance': 'Balance',
    'common.tag.coordination': 'Coordination',
    'common.tag.confidence': 'Confidence',
    'common.tag.expression': 'Expression',
    'common.tag.fine_motor': 'Fine Motor',
    'common.tag.identity': 'Identity',
    'common.tag.food_awareness': 'Food Awareness',
    'common.tag.decision_making': 'Decision Making',

    // Attendance Namespaces
    'attendance.scanner_title': 'AI Class Scanner',
    'attendance.scanning': 'Scanning Faces...',
    'attendance.hold_steady': 'Please hold the device steady',
    'attendance.scan_complete': 'Scan Complete!',
    'attendance.scan_summary': 'Identified {present} out of {total} children present. Review before submitting.',
    'attendance.present': 'Present',
    'attendance.absent': 'Absent',
    'attendance.processing': 'Processing Scan...',
    'attendance.submit_count': 'Submit {present}/{total} Present',

    // Dashboard Namespaces
    'dashboard.title': 'Smart Anganwadi Command Centre',
    'dashboard.subtitle': 'Simpler workflows for workers, richer insights for every child.',
    'dashboard.enrolled': 'Enrolled children',
    'dashboard.avg_learning': 'Average learning',
    'dashboard.attendance': 'Attendance',
    'dashboard.nutrition_alerts': 'Nutrition alerts',
    'dashboard.learning_journey': "Today's Learning Journey",
    'dashboard.child_development': 'Child Development',
    'dashboard.quick_assessment': 'Quick Assessment Snapshot',
    'dashboard.radar_chart': 'Assessment Radar',
    'dashboard.theme_current': 'Current theme',
    'dashboard.stars_earned': 'Stars earned',
    'dashboard.offline_packs': 'Offline packs',
    'dashboard.hero.badge': 'Smart Anganwadi Command Centre',
    'dashboard.hero.title': 'Simpler workflows for workers, richer insights for every child.',
    'dashboard.hero.desc': 'ICDS-aligned operations, NEP 2020 learning journeys, parent updates, nutrition tracking, and offline-first support in one place.',
    'dashboard.hero.btn_learning': "Open Today's Learning Journey",
    'dashboard.hero.btn_nutrition': 'View Health & Nutrition',
    'dashboard.stats.sync_status': 'Sync status',
    'dashboard.stats.online': 'Online',
    'dashboard.stats.offline': 'Offline',
    'dashboard.stats.sync_ready': 'Content ready to sync',
    'dashboard.stats.sync_queue': 'Offline queue available',
    'dashboard.stats.activities_meta': '{completed}/5 activities completed',
    'dashboard.stats.offline_meta': 'Weekly content packs downloaded',
    'dashboard.stats.current_theme': 'Current Theme',
    'dashboard.stats.theme_meta': 'Focusing on foundational literacy',
    'dashboard.learning.title': "Today's Learning Journey",
    'dashboard.learning.desc': 'Five-card daily engine across cognitive, language, physical, creativity, and nutrition.',
    'dashboard.learning.btn': 'Open Screen',
    'dashboard.development.title': 'Child Development',
    'dashboard.development.desc': 'Profile snapshots with growth status and auto-generated insights.',
    'dashboard.development.btn': 'View Children',
    'dashboard.assessment.title': 'Quick Assessment Snapshot',
    'dashboard.assessment.desc': 'One-tap observations with auto-save for daily classroom use.',
    'dashboard.assessment.autosave': 'Auto-saved daily observation',
    'dashboard.radar.title': 'Assessment Radar',
    'dashboard.radar.desc': 'Cognitive, language, physical, social, and creativity readiness.',
    'dashboard.actions.title': 'Parent & Offline Actions',
    'dashboard.actions.notifications': 'Parent Notifications ({count})',
    'dashboard.actions.meals': 'Meals Served ({count})',
    'dashboard.actions.badges': 'Badges Awarded ({count})',
    'dashboard.actions.download': 'Download Reports',
    'dashboard.actions.mark_attendance': 'Mark Daily Attendance',
    'dashboard.charts.attendance_trend': 'Average Attendance Trend',
    'dashboard.charts.nutrition_distribution': 'Nutrition Status Distribution',
    'dashboard.charts.learning_summary': 'Learning Progress Summary',
    'dashboard.insights.center_alerts': 'Center-wide AI Alerts',
    'dashboard.stats.present_today': 'Present Today',

    // Children Namespaces
    'children.title': 'Child Development Module',
    'children.subtitle': 'Monitor and manage child growth and learning progress',
    'children.search_placeholder': 'Search by name or parent...',
    'children.no_results': 'No children found in this category.',
    'children.actions.register': 'Register New Child',
    'children.actions.quick_assessment': 'Quick Assessment',
    'children.filter.risk_only': 'High Risk Only',
    'children.stats.total': 'Total Enrolled',
    'children.stats.malnourished': 'Malnourished',
    'children.stats.attendance': 'Today\'s Attendance',
    'children.batch_beginner': 'Beginners Batch (3-4 Years)',
    'children.batch_intermediate': 'Intermediate Batch (4-5 Years)',
    'children.batch_advanced': 'Advanced Batch (5-6 Years)',
    'children.count_single': '{count} Child',
    'children.count_multiple': '{count} Children',

    // Status Namespaces
    'status.normal': 'Normal',
    'status.mam': 'MAM',
    'status.sam': 'SAM',
    'status.boy': 'Boy',
    'status.girl': 'Girl',
    'status.stunted': 'Stunted',
    'status.underweight': 'Underweight',
    'status.low_attendance': 'Low Attendance',
    'status.wasted': 'Wasted',
    'status.healthy': 'Healthy',
    'status.monitor': 'Monitor',
    'status.attention_needed': 'Attention Needed',
    'status.severely_underweight': 'Severely Underweight',
    'status.severely_stunted': 'Severely Stunted',
    'status.severely_wasted': 'Severely Wasted',
    'status.months': 'months',
    'status.years': 'years',
    'status.yr': 'yr',
    'status.mo': 'mo',
    'status.just_now': 'Just now',
    'status.min_ago': '{count}m ago',
    'status.hr_ago': '{count}h ago',
    'status.day_ago': '{count}d ago',
    'status.good': 'Good',
    'status.warning': 'Warning',
    'status.critical': 'Critical',
    'status.verb_need': 'need',
    'status.verb_needs': 'needs',

    // Insights Namespaces
    'insights.ai_title': 'AI-Powered Insights',
    'insights.ai_subtitle': 'Personalized recommendations for your students',
    'insights.at_risk': 'At Risk',
    'insights.nutrition_alerts': 'Nutrition Alerts',
    'insights.learning_help': 'Need Learning Help',
    'insights.on_track': 'On Track',
    'insights.take_action': 'Take Action',
    'insights.sam_critical': '{count} SAM cases detected',
    'insights.sam_message': '{names} {verb} immediate referral to NRC for medical stability.',
    'insights.attendance_warning': '{count} children with low attendance',
    'insights.attendance_message': '{names} missed significantly this month (avg {rates}%). Home visits recommended.',
    'insights.learning_warning': '{count} children need learning support',
    'insights.learning_message': '{names} are struggling with core concepts. Try simpler visual aids.',
    'insights.assessment_reminder': 'Daily Assessment Reminder',
    'insights.assessment_desc': "You haven't assessed 12 children today. It takes 30 seconds per child.",
    'insights.progress_success': 'Major progress by {name}',
    'insights.progress_message': 'Learning scores improved 25% after consistent attendance last month.',
    'insights.action.nrc': 'Refer to NRC',
    'insights.action.visits': 'Plan Home Visits',
    'insights.action.easy': 'View Simple Activities',
    'insights.action.assessment': 'Complete Assessments',
    'insights.action.profile': 'View Profiles',

    // Data Mock Namespaces (used in data/mockData.ts)
    'data.activity.match.instructions': 'Use family picture cards and ask the child to match counts with number tiles.',
    'data.activity.story.instructions': 'Play the family audio prompt and ask each child to add one sentence.',
    'data.activity.physical.instructions': 'Create a path with chalk circles and ask children to hop to each family role.',
    'data.activity.draw.instructions': 'Offer crayons and prompt children to add themselves, a caregiver, and a favorite object.',
    'data.activity.nutrition.instructions': 'Show local meal flashcards and ask children to sort foods for strength.',
    'data.activity.match.title': 'Count & Match',
    'data.activity.story.title': 'Storytelling Circle',
    'data.activity.physical.title': 'Jump & Balance',
    'data.activity.draw.title': 'Draw Your Family',
    'data.activity.nutrition.title': 'Healthy vs Junk',
    'data.persona.fast_learner': 'Fast Learner',
    'data.persona.visual_learner': 'Visual Learner',
    'data.persona.curious_explorer': 'Curious Explorer',
    'data.persona.social_butterfly': 'Social Butterfly',
    'data.persona.creative_thinker': 'Creative Thinker',
    'data.persona.needs_support': 'Needs Support',
    'data.insight.on_track.title': 'Child is on track for age',
    'data.insight.on_track.detail': 'Language, numeracy, and attendance trends are consistently above the centre average.',
    'data.insight.needs_improvement.title': 'Needs improvement in language skills',
    'data.insight.needs_improvement.detail': 'Vocabulary recall is improving, but expressive storytelling still needs guided prompts.',
    'data.insight.immediate_support.title': 'Immediate support recommended',
    'data.insight.immediate_support.detail': 'Nutrition and attendance gaps are affecting learning stamina and cognitive participation.',
    'data.insight.recovering.title': 'Recovering Trajectory',
    'data.insight.recovering.detail': 'Weight is stabilising, but meal adherence and home follow-up should continue this week.',
    'data.insight.intervention.title': 'Nutritional Intervention Required',
    'data.insight.intervention.detail': 'Weight trajectory has been declining for 2 months. Immediate home-visit and supplemental feeding coordination needed.',
    'data.insight.attendance.title': 'Consistent Attendance',
    'data.insight.attendance.detail': 'Showing 95% attendance this month, correlating with improved social skills.',
    'data.meal.suji_upma': 'Suji Upma',
    'data.meal.rice_dalma': 'Rice and Dalma',
    'data.meal.khichdi': 'Vegetable Khichdi',
    'data.notification.growth_audit.title': 'Monthly Growth Audit',
    'data.notification.growth_audit.msg': 'Please complete measurements for Batch A.',
    'data.notification.policy_update.title': 'Policy Update',
    'data.notification.policy_update.msg': 'New dietary guidelines released for ICDS.',
    'data.report.week_label': 'Week 1, April',
    'data.report.summary_c1': "Aarav has been very active in the 'My Family' activities. He particularly enjoyed drawing his home.",
    'data.report.highlight.roles': 'Recognized 5 family roles in Odia',
    'data.report.highlight.counting': 'Counted up to 10 family members',
    'data.report.highlight.motor': 'Improved fine motor skills with coloring',
    'data.report.suggested_home': 'Ask Aarav to name three things he loves about his home during dinner.',
    'data.insight.avg_attendance': 'Average Attendance',
    'data.insight.malnutrition_level': 'Malnutrition Level',
    'data.insight.learning_scores': 'Learning Scores',
    'data.insight.sync_status': 'Health Records Sync',
    'data.badge.star_helper.title': 'Star Helper',
    'data.badge.star_helper.description': 'Awarded for helping peers during group activities.',
    'data.theme.family': 'My Family',
    'data.theme.animals': 'Animals',
    'data.theme.seasons': 'Seasons',
    'data.theme.helpers': 'Community Helpers',
    'data.theme.nature': 'Nature',
    'data.badge.learner.title': 'Active Learner',
    'data.badge.learner.desc': 'Completed all five activities this week.',
    'data.badge.communicator.title': 'Good Communicator',
    'data.badge.communicator.desc': 'Participated in storytelling and answered with confidence.',
    'data.badge.nutrition.title': 'Nutrition Champion',
    'data.badge.nutrition.desc': 'Consistently chose healthy foods during sorting activities.',

    // Learning Module Namespaces
    'learning.hero.badge': "Today's Learning Journey",
    'learning.hero.title': 'A detailed teaching workspace for Anganwadi classrooms.',
    'learning.hero.desc': 'Theme-based daily learning, detailed teaching modules, 3D shape exploration, storytelling videos, exercises, and classroom assessment in one flow.',
    'learning.stats.theme_active': 'Theme active',
    'learning.stats.modules': 'Teaching modules',
    'learning.stats.videos': 'Story videos',
    'learning.stats.autosave': 'Auto-save enabled',
    'learning.theme.title': 'Monthly Theme Selector',
    'learning.theme.desc': 'Activities, videos, modules, and practice exercises update automatically with theme selection.',
    'learning.modules.title': 'Teaching Modules',
    'learning.modules.desc': 'Detailed, teacher-ready modules with objectives, materials, step-by-step flow, and child tasks.',
    'learning.modules.start': 'Start Module',
    'learning.modules.flow': 'Teacher Flow',
    'learning.modules.tasks': 'Child Tasks & Materials',
    'learning.activity.title': 'Daily Activity Engine',
    'learning.activity.desc': 'Five structured activity cards for direct classroom use.',
    'learning.activity.detail': 'Selected Activity Detail',
    'learning.activity.mins': '{count} minutes',
    'learning.shapes.title': '3D Shape Studio',
    'learning.shapes.desc': 'Hands-on 3D shape teaching with classroom examples, key points, and mini tasks.',
    'learning.shapes.concept': '3D concept',
    'learning.shapes.minitask': 'Mini task: {task}',
    'learning.videos.title': 'Storytelling Video Shelf',
    'learning.videos.desc': 'Video-ready storytelling modules with language support, discussion prompts, and learning goals.',
    'learning.videos.goals': 'Learning Goals',
    'learning.videos.prompts': 'Discussion Prompts',

    // Theme Namespaces
    'theme.family': 'My Family',
    'theme.animals': 'Animals',
    'theme.seasons': 'Seasons',
    'theme.helpers': 'Community Helpers',

    // Progress Namespaces
    'progress.attendance': 'Attendance',
    'progress.nutrition': 'Nutrition',
    'progress.learning': 'Learning',

    // Board Namespaces
    'board.chalk_board': 'Chalk Board',
    'board.tool.pen': 'Pen',
    'board.tool.highlighter': 'Highlighter',
    'board.tool.eraser': 'Eraser',
    'board.tool.shapes': 'Shapes',
    'board.tool.text': 'Text',
    'board.tool.stamps': 'Stamps',
    'board.tool.tracing': 'Tracing',
    'board.tool.tools': 'Tools',
    'board.tool.size': 'Size',
    'board.tool.color': 'Color',
    'board.tool.theme': 'Board Theme',
    'board.new_page': 'New Page',
    'board.fullscreen': 'Fullscreen',
    'board.exit_fullscreen': 'Exit Fullscreen',
    'board.stamps.reward': 'Reward Stamps',
    'board.tracing.guide': 'Tracing Guides',
    'board.teaching_tools': 'Teaching Tools',
    'board.timer': 'Timer',
    'board.dice': 'Dice',
    'board.random_student': 'Random Student',
    'board.color.black': 'Black',
    'board.color.white': 'White',
    'board.color.yellow': 'Yellow',
    'board.color.pink': 'Pink',
    'board.color.blue': 'Sky Blue',
    'board.color.orange': 'Orange',
    'board.color.lime': 'Lime',
    'board.color.red': 'Red',
    'board.color.violet': 'Violet',
    'board.tracing.odia_vowels': 'Odia Vowels',
    'board.tracing.odia_consonants': 'Odia Consonants',
    'board.tracing.hindi_vowels': 'Hindi Vowels',
    'board.tracing.hindi_consonants': 'Hindi Consonants',
    'board.tracing.english_upper': 'English A-Z',
    'board.tracing.english_lower': 'English a-z',
    'board.tracing.numbers': 'Numbers 0-9',
    'board.tracing.shapes': 'Shapes',
    'board.tracing.patterns': 'Pre-Writing',
    'board.stamps.star': 'Star',
    'board.stamps.correct': 'Correct',
    'board.stamps.love': 'Love',
    'board.stamps.good': 'Good',
    'board.stamps.happy': 'Happy',
    'board.stamps.winner': 'Winner',

    // Administration Namespaces
    'admin.district_dashboard': 'District Dashboard',
    'admin.block_performance': 'Block-wise Performance',
    'admin.trend_6month': '6-Month Trend',
    'admin.heatmap_title': 'Block-wise Performance Heatmap',
    'admin.learning_improvement': 'Learning Improvement',
    'admin.malnutrition_reduction': 'Malnutrition Reduction',
    'admin.nutrition_risk': 'Nutrition Risk',

    // Supervisor Namespaces
    'supervisor.dashboard_title': 'Supervisor Dashboard',
    'supervisor.block_overview': 'Bhawanipatna Block · Kalahandi District - Block-Level Overview',
    'supervisor.total_children': 'Total Children',
    'supervisor.nutrition_risk': 'Nutrition Risk',
    'supervisor.avg_learning': 'Avg Learning Score',
    'supervisor.critical_cases': 'Critical Cases',
    'supervisor.awc_performance': 'AWC-wise Performance',
    'supervisor.nutrition_categories': 'Nutrition Categories',
    'supervisor.all_clear': 'All clear',
    'supervisor.alerts_count': '{count} alerts',
    'supervisor.awc_detail': 'AWC Detail',
    'supervisor.active_alerts': 'Active Alerts',
    'supervisor.present_today': 'Present Today',
    'supervisor.enrolled_count': 'Children Enrolled ({count})',
    'supervisor.kpi.total_children': 'Total Children',
    'supervisor.kpi.nutrition_risk': 'Nutrition Risk',
    'supervisor.kpi.avg_learning': 'Avg Learning Score',
    'supervisor.kpi.critical_cases': 'Critical Cases',
    'supervisor.kpi.present_today': '{count} present today',
    'supervisor.kpi.nutrition_sub': '{sam} SAM · {mam} MAM',
    'supervisor.chart.awc_performance': 'AWC-wise Performance',
    'supervisor.chart.learning': 'Learning %',
    'supervisor.chart.attendance': 'Attendance %',
    'supervisor.chart.nutrition_categories': 'Nutrition Categories',
    'supervisor.table.title': 'Anganwadi Centres',
    'supervisor.table.centre_name': 'Centre Name',
    'supervisor.table.worker': 'Worker',
    'supervisor.table.status': 'Status',
    'supervisor.table.children': 'Children',
    'supervisor.table.learning': 'Learning',
    'supervisor.table.attendance': 'Attendance',
    'supervisor.table.alerts': 'Alerts',
    'supervisor.table.all_clear': 'All clear',
    'supervisor.table.alerts_count': '{count} alerts',

    // AWC Detail Namespaces
    'awc_detail.not_found': 'AWC not found.',
    'awc_detail.back': 'Back',
    'awc_detail.active_alerts': 'Active Alerts',
    'awc_detail.present_today': 'Present Today',
    'awc_detail.avg_learning': 'Avg Learning',
    'awc_detail.attendance_rate': 'Attendance Rate',
    'awc_detail.critical_cases': 'Critical Cases',
    'awc_detail.nutrition_breakdown': 'Nutrition Breakdown',
    'awc_detail.children_enrolled': 'Children Enrolled ({count})',
    'awc_detail.table.name': 'Name',
    'awc_detail.table.age': 'Age',
    'awc_detail.table.learning': 'Learning',
    'awc_detail.table.nutrition': 'Nutrition',
    'awc_detail.table.attendance': 'Attendance',
    'awc_detail.table.risk': 'Risk',

    // District Namespaces
    'district.dashboard_title': 'District Dashboard',
    'district.subtitle': 'Kalahandi District · ICDS, Odisha - District-wide Analytics',
    'district.ai_analytics': 'AI-Powered Analytics',
    'district.kpi.total_awcs': 'Total AWCs',
    'district.kpi.total_children': 'Total Children',
    'district.kpi.learning_improvement': 'Learning ↑',
    'district.kpi.malnutrition_reduction': 'Malnutrition ↓',
    'district.kpi.avg_attendance': 'Avg Attendance',
    'district.kpi.active_alerts': 'Active Alerts',
    'district.kpi.sub_improvement': 'Improvement',
    'district.kpi.sub_reduction': 'Reduction',
    'district.chart.block_performance': 'Block-wise Performance',
    'district.chart.trend_6months': '6-Month Trend',
    'district.chart.avg_learning': 'Avg Learning %',
    'district.chart.nutrition_risk': 'Nutrition Risk %',
    'district.heatmap.title': 'Block-wise Performance Heatmap',
    'district.heatmap.awcs': 'AWCs',
    'district.heatmap.children': 'Children',
    'district.heatmap.learning': 'Learning',
    'district.heatmap.nutrition_risk': 'Nutrition Risk',
    'district.heatmap.performance_legend': 'Performance:',
    'district.insights.title': 'AI-Generated Insights',
    'district.insights.take_action': 'Take Action',
    'district.insights.critical_malnutrition_title': 'High Malnutrition Risk in Khallikote Block',
    'district.insights.critical_malnutrition_msg': 'Khallikote block shows 35% children at nutrition risk — 2.5x the district average. 12 SAM cases detected across 4 AWCs. Immediate intervention recommended.',
    'district.insights.kanjiaguda_intervention_title': 'AWC Kanjiaguda-2 Needs Intervention',
    'district.insights.kanjiaguda_intervention_msg': 'Attendance dropped to 50%. Worker device offline for 3 days. 4 critical cases pending sync. CDPO visit recommended.',
    'district.insights.beguniapada_learning_title': 'Beguniapada Block: Declining Learning Scores',
    'district.insights.beguniapada_learning_msg': 'Average learning score dropped from 58 to 48 over last quarter. 28% children at nutrition risk correlating with learning decline.',
    'district.insights.ganjam_success_title': 'Kesinga Block Achieves Target',
    'district.insights.ganjam_success_msg': 'Kesinga block achieved 74% avg learning score and only 8% nutrition risk, meeting the quarterly targets. Model practices can be replicated.',
    'district.insights.monsoon_advisory_title': 'Monsoon Season Advisory',
    'district.insights.monsoon_advisory_msg': 'Historically, attendance drops 15-20% during monsoon across southern blocks. Pre-emptive community engagement recommended.',
    'district.insights.sorada_sam_cluster_title': 'SAM Case Cluster in Sorada Area',
    'district.insights.sorada_sam_cluster_msg': '3 new SAM cases detected in AWC Sorada-6. Nutrition-learning correlation shows these children\'s cognitive scores are declining rapidly.',

    // Misc Namespaces
    'risk.low': 'Low',
    'risk.medium': 'Medium',
    'risk.high': 'High',
    'months.jan': 'Jan',
    'months.feb': 'Feb',
    'months.mar': 'Mar',
    'months.apr': 'Apr',
    'months.may': 'May',
    'months.jun': 'Jun',
    'months.jul': 'Jul',
    'months.aug': 'Aug',
    'months.sep': 'Sep',
    'months.oct': 'Oct',
    'months.nov': 'Nov',
    'months.dec': 'Dec',
    'arunima.title': 'Arunima Booklet',
    'arunima.progress': 'Progress',
    'arunima.modules': 'Modules',
    'arunima.activity': 'Activity',
    'arunima.areas_for_improvement': 'Areas for Improvement',
    'arunima.competency': 'Competency',
    'arunima.level_advanced': 'Advanced',
    'arunima.level_developing': 'Developing',
    'arunima.level_emerging': 'Emerging',
    'arunima.level_proficient': 'Proficient',
    'arunima.milestone': 'Milestone',
    'arunima.next_steps': 'Next Steps',
    'arunima.overall_progress': 'Overall Progress',
    'arunima.recommendations': 'Recommendations',
    'arunima.select_student': 'Select Student',
    'arunima.strengths': 'Strengths',
    'arunima.student_report': 'Student Report',
    'arunima.view_report': 'View Report',
    'board.labels.actions': 'Actions',
    'board.labels.draw': 'Draw',
    'board.labels.insert': 'Insert',
    'board.pages.page_of': 'Page {current} of {total}',
    'board.tools.pause': 'Pause',
    'board.tools.pick': 'Pick',
    'board.tools.roll': 'Roll',
    'board.tools.start': 'Start',
    'board.tracing.trace_message': 'Trace over the guide to practice.',
    'children.card.assess': 'Assess',
    'children.card.attendance': 'Attendance',
    'children.card.learning': 'Learning',
    'children.card.view_metrics': 'View Metrics',
    'children.filter.showing': 'Showing {count} children',
    'children.no_results_desc': 'Try changing the search or filters to see more children.',
    'common.no_results': 'No results found',
    'dashboard.charts.attendance_desc': 'Attendance trend for the week across the centre.',
    'dashboard.charts.nutrition_desc': 'Nutrition status split across enrolled children.',
    'dashboard.insights': 'AI Insights',
    'dashboard.insights.attendance_drop_msg': 'Attendance has dipped in the last three days. Follow up with families who were absent.',
    'dashboard.insights.sam_critical_msg': 'One child needs immediate nutrition follow-up and referral support.',
    'dashboard.stats.attendance': 'Attendance',
    'dashboard.stats.avg_learning': 'Avg Learning',
    'dashboard.stats.enrolled': 'Enrolled',
    'dashboard.stats.nutrition_alerts': 'Nutrition Alerts',
    'dashboard.stats.offline_packs': 'Offline Packs',
    'dashboard.stats.stars_earned': 'Stars Earned',
    'board.subtitle': 'Board for teaching, drawing, and classroom learning',
    'nutrition.title': 'Health & Nutrition',
    'nutrition.subtitle': 'Meal logging, growth tracking, health alerts, and offline weekly content support.',
    'nutrition.btn_download': 'Download Weekly Content',
    'nutrition.stats.meals': 'Daily Meal Logs',
    'nutrition.stats.underweight': 'Underweight Alerts',
    'nutrition.stats.missed': 'Missed Nutrition',
    'nutrition.chart.title': 'Growth Tracking Chart',
    'nutrition.chart.desc': 'Average height and weight trends for enrolled children.',
    'nutrition.alerts.title': 'Health Alerts',
    'nutrition.alerts.desc': 'Nutrition follow-up recommended.',
    'nutrition.offline.title': 'Offline Content Packs',
    'nutrition.offline.items': '{count} learning items',
    'nutrition.offline.ready': 'Ready to download',
    'nutrition.offline.synced': 'Synced {time}',
    'parents.title': 'Parent Engagement',
    'parents.subtitle': 'Shareable weekly reports, meal and attendance updates, immunization reminders, and home activity suggestions.',
    'parents.btn_share': 'Share Weekly Report',
    'parents.stats.families': 'Families reached',
    'parents.stats.notifications': 'This week notifications',
    'parents.stats.home_activities': 'Planned home activities',
    'parents.report.child_report': 'Child Report',
    'parents.report.shareable': 'Shareable',
    'parents.report.skills_learned': 'Skills learned',
    'parents.report.areas_improve': 'Areas to improve',
    'parents.report.home_activities': 'Home activities',
    'parents.report.notifications': 'Notifications',
    'locale': 'en',
    'nutrition.normal': 'Normal',
    'nutrition.mam': 'MAM',
    'nutrition.sam': 'SAM',
    'status.average': 'Average',
    'status.poor': 'Poor',
  },
  od: {
    // Header
    'header.title': 'ସ୍ମାର୍ଟ ଆଙ୍ଗନୱାଡି',
    'header.subtitle': 'ICDS କାର୍ଯ୍ୟପରିଚାଳନା, ଶିଶୁ ବିକାଶ ଓ ଅଭିଭାବକ ସହଭାଗିତା',
    'header.online': 'ଅନଲାଇନ୍',
    'header.offline': 'ଅଫଲାଇନ୍',
    'header.pending': 'ଅପେକ୍ଷାରତ',
    'header.synced': 'ସିଙ୍କ ହୋଇଛି',
    'header.notifications': 'ବିଜ୍ଞପ୍ତି',
    'header.mark_all_read': 'ସବୁକୁ ପଢିତ ଭାବେ ଚିହ୍ନଟ କରନ୍ତୁ',
    'header.no_notifications': 'କୌଣସି ବିଜ୍ଞପ୍ତି ନାହିଁ',
    'header.theme_light': 'ଲାଇଟ ମୋଡକୁ ବଦଳାନ୍ତୁ',
    'header.theme_dark': 'ଡାର୍କ ମୋଡକୁ ବଦଳାନ୍ତୁ',

    // Roles
    'role.worker': 'ଅଙ୍ଗନୱାଡି କର୍ମୀ',
    'role.supervisor': 'ସୁପରଭାଇଜର',
    'role.admin': 'ପ୍ରଶାସକ',
    'role.logged_in_as': 'ଭାବରେ ଲଗଇନ୍ ହୋଇଛନ୍ତି',

    // Nav
    'nav.dashboard': 'ଡ୍ୟାଶବୋର୍ଡ',
    'nav.children': 'ପିଲାମାନେ',
    'nav.learning': 'ପାଠପଢ଼ା ଯାତ୍ରା',
    'nav.nutrition': 'ସ୍ୱାସ୍ଥ୍ୟ ଓ ପୁଷ୍ଟିକର ଖାଦ୍ୟ',
    'nav.parents': 'ଅଭିଭାବକ ରିପୋର୍ଟ',
    'nav.board': 'ଡିଜିଟାଲ୍ ବୋର୍ଡ',
    'nav.insights': 'AI ଅନ୍ତର୍ଦୃଷ୍ଟି',
    'nav.overview': 'ସମୀକ୍ଷା',
    'nav.awc_list': 'AWC ତାଲିକା',
    'nav.analytics': 'ବିଶ୍ଳେଷଣ',
    'nav.district': 'ଜିଲ୍ଲା ଡ୍ୟାଶବୋର୍ଡ',
    'nav.heatmap': 'ହିଟମ୍ୟାପ୍',
    'nav.reports': 'ରିପୋର୍ଟ',
    'nav.settings': 'ସେଟିଂସ',
    'nav.logout': 'ଲଗଆଉଟ୍',

    'nav.group.dashboard': 'ଡ୍ୟାଶବୋର୍ଡ',
    'nav.group.children': 'ଶିଶୁ',
    'nav.group.learning': 'ଶିକ୍ଷା',
    'nav.group.nutrition_health': 'ପୋଷଣ ଓ ସ୍ୱାସ୍ଥ୍ୟ',
    'nav.group.attendance': 'ଉପସ୍ଥିତି',
    'nav.group.interventions': 'ହସ୍ତକ୍ଷେପ',
    'nav.group.reports': 'ରିପୋର୍ଟ',
    'nav.group.offline_sync': 'ଅଫଲାଇନ୍ ସିଙ୍କ୍',
    'nav.group.overview': 'ସମୀକ୍ଷା',
    'nav.group.monitoring': 'ନିରୀକ୍ଷଣ',
    'nav.group.health_stats': 'ସ୍ୱାସ୍ଥ୍ୟ ଓ ତଥ୍ୟ',
    'nav.group.analytics_reports': 'ବିଶ୍ଳେଷଣ ଓ ରିପୋର୍ଟ',
    'nav.all_children': 'ସମସ୍ତ ଶିଶୁ',
    'nav.progress_tracking': 'ପ୍ରଗତି ଟ୍ରାକିଂ',
    'nav.learning_progress': 'ଶିକ୍ଷା ପ୍ରଗତି',
    'nav.learning_session': 'ଶିକ୍ଷା ସେସନ୍',
    'nav.adaptive_learning': 'ଅନୁକୂଳିତ ଶିକ୍ଷା',
    'nav.whiteboard': 'ହ୍ୱାଇଟବୋର୍ଡ',
    'nav.nutrition_status': 'ପୋଷଣ ସ୍ଥିତି',
    'nav.predictive_risk': 'ପୂର୍ବାନୁମାନିତ ବିପଦ',
    'nav.immunization': 'ଟୀକାକରଣ',
    'nav.daily_attendance': 'ଦୈନିକ ଉପସ୍ଥିତି',
    'nav.critical_alerts': 'ଗୁରୁତର ସତର୍କତା',
    'nav.ai_dashboard': 'AI ଡ୍ୟାଶବୋର୍ଡ',
    'nav.suggested_actions': 'ସୁପାରିଶିତ କାର୍ଯ୍ୟ',
    'nav.training': 'ପ୍ରଶିକ୍ଷଣ',
    'nav.offline_sync': 'ଅଫଲାଇନ୍ ସିଙ୍କ୍',
    'nav.centres_directory': 'କେନ୍ଦ୍ର ତାଲିକା',
    'nav.attendance_trends': 'ଉପସ୍ଥିତି ଧାରା',
    'nav.educational_progress': 'ଶିକ୍ଷା ପ୍ରଗତି',
    'nav.nutrition_tracking': 'ପୋଷଣ ଟ୍ରାକିଂ',
    'nav.immunization_coverage': 'ଟୀକାକରଣ କଭରେଜ୍',
    'nav.generate_reports': 'ରିପୋର୍ଟ ତିଆରି',
    'nav.training_progress': 'ପ୍ରଶିକ୍ଷଣ ପ୍ରଗତି',
    'nav.system_monitoring': 'ସିଷ୍ଟମ୍ ନିରୀକ୍ଷଣ',
    'nav.integrations': 'ଇଣ୍ଟିଗ୍ରେସନ୍',
    'language.english': 'ଇଂରାଜୀ',
    'language.odia': 'ଓଡ଼ିଆ',
    'common.district_suffix': 'ଜିଲ୍ଲା',

    // New Keys
    growth_dashboard: 'ବୃଦ୍ଧି ଡ୍ୟାସବୋର୍ଡ',
    physical_growth: 'ଶାରୀରିକ ବୃଦ୍ଧି',
    attendance_consistency: 'ଉପସ୍ଥାନର ସ୍ଥିରତା',
    school_readiness: 'ସ୍କୁଲ୍ ପାଇଁ ପ୍ରସ୍ତୁତି',
    growth_note: 'ଓଜନ, ଉଚ୍ଚତା ଏବଂ ଅଂଶଗ୍ରହଣର ଧାରା',
    attendance_note: 'ଯତ୍ନର ନିରନ୍ତରତା ପାଇଁ ଉପଯୋଗୀ ପୂର୍ବାନୁମାନକାରୀ',
    readiness_note: 'ଶିକ୍ଷା ଏବଂ ନିୟମିତ ସ୍କୋରର ସମ୍ମିଳିତ ରୂପ',
    smart_insights: 'ସ୍ମାର୍ଟ ଅନ୍ତର୍ଦୃଷ୍ଟି ପ୍ୟାନେଲ୍',
    assessment_progress: 'ମୂଲ୍ୟାଙ୍କନ ଏବଂ ପ୍ରଗତି',
    holistic_view: 'ପାଞ୍ଚଟି ବିକାଶମୂଳକ କ୍ଷେତ୍ରରେ ସାମଗ୍ରିକ ଦୃଶ୍ୟ |',
    cognitive: 'ଜ୍ଞାନଗତ',
    language: 'ଭାଷା',
    physical: 'ଶାରୀରିକ',
    social: 'ସାମାଜିକ',
    creativity: 'ସୃଜନଶୀଳତା',
    home_activities: 'ଘରୋଇ କାର୍ଯ୍ୟକଳାପ',
    no_report: 'ସାପ୍ତାହିକ ରିପୋର୍ଟ ଏପର୍ଯ୍ୟନ୍ତ ଉପଲବ୍ଧ ନାହିଁ |',
    badges_meal_log: 'ବ୍ୟାଜ୍ ଏବଂ ଖାଦ୍ୟ ଲଗ୍',
    back_to_children: 'ପିଲାଙ୍କ ପାଖକୁ ଫେରନ୍ତୁ',
    open_parent_report: 'ଅଭିଭାବକ ରିପୋର୍ଟ ଖୋଲନ୍ତୁ',
    child_not_found: 'ପିଲା ମିଳିଲା ନାହିଁ |',
    district_dashboard: 'ଜିଲ୍ଲା ଡ୍ୟାସବୋର୍ଡ',
    district_analytics: 'ଜିଲ୍ଲା ସ୍ତରୀୟ ବିଶ୍ଳେଷଣ',
    district_subtitle: 'କଳାହାଣ୍ଡି ଜିଲ୍ଲା · ICDS, ଓଡ଼ିଶା - ଜିଲ୍ଲା ସ୍ତରୀୟ ବିଶ୍ଳେଷଣ',
    ai_powered: 'AI- ଚାଳିତ ବିଶ୍ଳେଷଣ',
    total_awcs: 'ମୋଟ ଅଙ୍ଗନୱାଡି କେନ୍ଦ୍ର',
    total_children: 'ମୋଟ ଶିଶୁ',
    learning_improvement: 'ଶିକ୍ଷା ଦାନରେ ଉନ୍ନତି ↑',
    malnutrition_reduction: 'ଅପପୁଷ୍ଟି ହ୍ରାସ ↓',
    avg_attendance: 'ହାରାହାରି ଉପସ୍ଥାନ',
    active_alerts: 'ସକ୍ରିୟ ସତର୍କତା',
    block_performance: 'ବ୍ଲକ୍ ସ୍ତରୀୟ ପ୍ରଦର୍ଶନ',
    six_month_trend: '୬ ମାସର ଧାରା',
    heatmap: 'ବ୍ଲକ୍ ସ୍ତରୀୟ ପ୍ରଦର୍ଶନ ହିଟ୍-ମ୍ୟାପ୍',
    performance_label: 'ପ୍ରଦର୍ଶନ:',
    'common.good': 'ଭଲ',
    'common.average': 'ମଧ୍ୟମ',
    'common.poor': 'ଖରାପ',
    'district.insights.title': 'AI- ଜନିତ ଅନ୍ତର୍ଦୃଷ୍ଟି',
    'district.insights.take_action': 'କାର୍ଯ୍ୟାନୁଷ୍ଠାନ ଗ୍ରହଣ କରନ୍ତୁ',
    'district.insights.critical_malnutrition_title': 'ଖଲ୍ଲିକୋଟ ବ୍ଲକରେ ହାଇ ପୁଷ୍ଟିହୀନତା ବିପଦ',
    'district.insights.critical_malnutrition_msg': 'ଖଲ୍ଲିକୋଟ ବ୍ଲକରେ ୩୫% ପିଲା ପୁଷ୍ଟିହୀନତା ବିପଦରେ ଅଛନ୍ତି - ଜିଲ୍ଲା ହାରଠାରୁ ୨.୫ ଗୁଣ ଅଧିକ | ୪ ଟି ଅଙ୍ଗନୱାଡି କେନ୍ଦ୍ରରେ ୧୨ ଟି SAM ମାମଲା ଚିହ୍ନଟ ହୋଇଛି | ତୁରନ୍ତ ହସ୍ତକ୍ଷେପ ପାଇଁ ସୁପାରିଶ କରାଯାଇଛି |',
    'district.insights.kanjiaguda_intervention_title': 'AWC କାଞ୍ଜିଆଗୁଡା-୨ ହସ୍ତକ୍ଷେପ ଆବଶ୍ୟକ କରେ',
    'district.insights.kanjiaguda_intervention_msg': 'ଉପସ୍ଥାପନ ୫୦% କୁ ହ୍ରାସ ପାଇଛି | କର୍ମୀଙ୍କ ଡିଭାଇସ୍ ୩ ଦିନ ଧରି ଅଫଲାଇନ୍ ରହିଛି | ୪ ଟି ଗୁରୁତର ମାମଲା ଅପେକ୍ଷା କରିଛି | CDPO ପରିଦର୍ଶନ ପାଇଁ ସୁପାରିଶ କରାଯାଇଛି |',
    'district.insights.beguniapada_learning_title': 'ବେଗୁନିଆପଡା ବ୍ଲକ୍: ଶିକ୍ଷଣ ସ୍କୋର ହ୍ରାସ ପାଉଛି',
    'district.insights.beguniapada_learning_msg': 'ଗତ ତ୍ରୟମାସିକରେ ହାରାହାରି ଶିକ୍ଷଣ ସ୍କୋର ୫୮ ରୁ ୪୮ କୁ ଖସି ଆସିଛି | ଶିକ୍ଷଣ ହ୍ରାସ ସହିତ ୨୮% ପିଲା ପୁଷ୍ଟିହୀନତା ବିପଦରେ ଅଛନ୍ତି |',
    'district.insights.ganjam_success_title': 'ଗଞ୍ଜାମ ବ୍ଲକ ଲକ୍ଷ୍ୟ ହାସଲ କରିଛି',
    'district.insights.ganjam_success_msg': 'ଗଞ୍ଜାମ ବ୍ଲକ୍ ୭୪% ହାରାହାରି ଶିକ୍ଷଣ ସ୍କୋର ଏବଂ ମାତ୍ର ୮% ପୁଷ୍ଟିହୀନତା ବିପଦ ହାସଲ କରିଛି, ଯାହା ତ୍ରୈମାସିକ ଲକ୍ଷ୍ୟ ପୂରଣ କରିଛି | ମଡେଲ ଅଭ୍ୟାସଗୁଡିକ ନକଲ କରାଯାଇପାରିବ |',
    'district.insights.monsoon_advisory_title': 'ମୌସୁମୀ ଋତୁ ପରାମର୍ଶ',
    'district.insights.monsoon_advisory_msg': 'ଐତିହାସିକ ଭାବରେ, ଦକ୍ଷିଣ ବ୍ଲକଗୁଡିକରେ ମୌସୁମୀ ସମୟରେ ଉପସ୍ଥାପନ ୧୫-୨୦% ହ୍ରାସ ପାଇଥାଏ | ପୂର୍ବ ପ୍ରସ୍ତୁତି ଭାବରେ ଗୋଷ୍ଠୀ ସହଭାଗିତା ପାଇଁ ସୁପାରିଶ କରାଯାଇଛି |',
    'district.insights.sorada_sam_cluster_title': 'ସୋରଡା ଅଞ୍ଚଳରେ SAM ମାମଲା ଗୋଷ୍ଠୀ',
    'district.insights.sorada_sam_cluster_msg': 'AWC ସୋରଡା-୬ ରେ ୩ ଟି ନୂତନ SAM ମାମଲା ଚିହ୍ନଟ ହୋଇଛି | ପୁଷ୍ଟିହୀନତା-ଶିକ୍ଷଣ ସମ୍ପର୍କ ଦର୍ଶାଉଛି ଯେ ଏହି ପିଲାମାନଙ୍କର ଜ୍ଞାନଗତ ସ୍କୋର ଦ୍ରୁତ ଗତିରେ ହ୍ରାସ ପାଉଛି |',
    'supervisor_dashboard': 'ପରିଦର୍ଶକ ଡ୍ୟାସବୋର୍ଡ',
    supervisor_subtitle: 'କେନ୍ଦ୍ର ସ୍ତରୀୟ ମନିଟରିଂ ଏବଂ ଦୈନିକ ପରିସଂଖ୍ୟାନ |',
    awc_performance_list: 'ଅଙ୍ଗନୱାଡି କେନ୍ଦ୍ର ପ୍ରଦର୍ଶନ ତାଲିକା',
    center_name: 'କେନ୍ଦ୍ରର ନାମ',
    sector: 'ସେକ୍ଟର',
    status: 'ସ୍ଥିତି',
    awcs: 'ଅଙ୍ଗନୱାଡି କେନ୍ଦ୍ର',
    children: 'ପିଲାମାନେ',
    manage_awc: 'କେନ୍ଦ୍ର ପରିଚାଳନା',
    pencil: 'ପେନସିଲ୍',
    eraser: 'ଇରେଜର',
    text_tool: 'ଲେଖା',
    shape: 'ଆକୃତି',
    stamp: 'ଷ୍ଟାମ୍ପ',
    undo: 'ପୂର୍ବବତ୍',
    redo: 'ପୁନରାବୃତ୍ତି',
    clear: 'ସଫା କରନ୍ତୁ',
    download: 'ଡାଉନଲୋଡ୍',
    save: 'ସଂରକ୍ଷଣ',
    black_board: 'କଳା ବୋର୍ଡ',
    white_board: 'ଧଳା ବୋର୍ଡ',
    green_board: 'ସବୁଜ ବୋର୍ଡ',
    graph_paper: 'ଗ୍ରାଫ୍ ପେପର୍',
    ruled_paper: 'ଗାର ଟଣା କାଗଜ',
    dotted_grid: 'ଡଟେଡ୍ ଗ୍ରୀଡ୍',
    choose_board: 'ବୋର୍ଡର ପ୍ରକାର ବାଛନ୍ତୁ',
    select_tracing: 'ଲେଖିବା ପାଇଁ ଗାଇଡ୍ ବାଛନ୍ତୁ',
    enter_text: 'ଲେଖା ପ୍ରବେଶ କରନ୍ତୁ:',
    page: 'ପୃଷ୍ଠା',


    // Status
    'status.normal': 'ସାଧାରଣ',
    'status.mam': 'MAM',
    'status.sam': 'SAM',
    'status.boy': 'ବାଳକ',
    'status.girl': 'ବାଳିକା',
    'status.stunted': 'କୁଣ୍ଠିତ ବୃଦ୍ଧି',
    'status.underweight': 'କମ୍ ଓଜନ',
    'status.low_attendance': 'କମ୍ ଉପସ୍ଥାନ',
    'status.wasted': 'କୃଶତା',
    'status.healthy': 'ସୁସ୍ଥ',
    'status.monitor': 'ନଜର ରଖନ୍ତୁ',
    'status.attention_needed': 'ଧ୍ୟାନ ଆବଶ୍ୟକ',
    'status.severely_underweight': 'ସାଂଘାତିକ କମ୍ ଓଜନ',
    'status.severely_stunted': 'ସାଂଘାତିକ କୁଣ୍ଠିତ ବୃଦ୍ଧି',
    'status.severely_wasted': 'ସାଂଘାତିକ କୃଶତା',
    'common.parent_label': 'ଅଭିଭାବକ: ',
    'attendance.scanner_title': 'AI ଶ୍ରେଣୀ ସ୍କାନର୍',
    'attendance.scanning': 'ମୁହୂର୍ତ୍ତ ସ୍କାନିଂ ହେଉଛି...',
    'attendance.hold_steady': 'ଦୟାକରି ଡିଭାଇସ୍ ସ୍ଥିର ରଖନ୍ତୁ',
    'attendance.scan_complete': 'ସ୍କାନ ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଛି!',
    'attendance.scan_summary': '{total} ପିଲାଙ୍କ ମଧ୍ୟରୁ {present} ଜଣଙ୍କୁ ଚିହ୍ନଟ କରାଯାଇଛି | ଜମା କରିବା ପୂର୍ବରୁ ସମୀକ୍ଷା କରନ୍ତୁ |',
    'attendance.present': 'ଉପସ୍ଥିତ',
    'attendance.absent': 'ଅନୁପସ୍ଥିତ',
    'attendance.processing': 'ସ୍କାନ ପ୍ରକ୍ରିୟାକରଣ ଚାଲିଛି...',
    'attendance.submit_count': '{present}/{total} ଜଣ ଉପସ୍ଥିତ ଦାଖଲ କରନ୍ତୁ',

    // Dashboard
    'dashboard.title': 'ସ୍ମାର୍ଟ ଅଙ୍ଗନୱାଡି କମାଣ୍ଡ ସେଣ୍ଟର',
    'dashboard.subtitle': 'କର୍ମୀଙ୍କ ପାଇଁ ସହଜ କାମ, ପ୍ରତି ପିଲାଙ୍କ ପାଇଁ ଗଭୀର ଅନ୍ତର୍ଦୃଷ୍ଟି |',
    'dashboard.enrolled': 'ନାମ ଲେଖାଇଥିବା ପିଲା',
    'dashboard.avg_learning': 'ହାରାହାରି ଶିକ୍ଷା',
    'dashboard.attendance': 'ଉପସ୍ଥାନ',
    'dashboard.nutrition_alerts': 'ପୁଷ୍ଟିକର ସତର୍କତା',
    'dashboard.learning_journey': "ଆଜିର ଶିକ୍ଷା ଯାତ୍ରା",
    'dashboard.child_development': 'ଶିଶୁ ବିକାଶ',
    'dashboard.quick_assessment': 'ତୁରନ୍ତ ଆକଳନ ସ୍ନାପସଟ୍',
    'dashboard.radar_chart': 'ଆକଳନ ରାଡାର୍',
    'dashboard.theme_current': 'ବର୍ତ୍ତମାନର ବିଷୟବସ୍ତୁ',
    'dashboard.stars_earned': 'ଅର୍ଜିତ ତାରକା',
    'dashboard.offline_packs': 'ଅଫଲାଇନ୍ ପ୍ୟାକ୍',
    'dashboard.hero.badge': 'ସ୍ମାର୍ଟ ଅଙ୍ଗନୱାଡି କମାଣ୍ଡ ସେଣ୍ଟର',
    'dashboard.hero.title': 'କର୍ମୀଙ୍କ ପାଇଁ ସହଜ କାମ, ପ୍ରତି ପିଲାଙ୍କ ପାଇଁ ଗଭୀର ଅନ୍ତର୍ଦୃଷ୍ଟି |',
    'dashboard.hero.desc': 'ICDS- ସମାନ୍ତରାଳ କାର୍ଯ୍ୟକଳାପ, NEP 2020 ଶିକ୍ଷା ଯାତ୍ରା, ଅଭିଭାବକ ଅପଡେଟ୍, ପୁଷ୍ଟିକର ଖାଦ୍ୟ ଟ୍ରାକିଂ ଏବଂ ଅଫଲାଇନ୍-ପ୍ରଥମ ସମର୍ଥନ ଏକ ସ୍ଥାନରେ |',
    'dashboard.hero.btn_learning': "ଆଜିର ଶିକ୍ଷା ଯାତ୍ରା ଖୋଲନ୍ତୁ",
    'dashboard.hero.btn_nutrition': 'ସ୍ୱାସ୍ଥ୍ୟ ଏବଂ ପୁଷ୍ଟିକର ଖାଦ୍ୟ ଦେଖନ୍ତୁ',
    'dashboard.stats.sync_status': 'ସିଙ୍କ୍ ଅବସ୍ଥା',
    'dashboard.stats.online': 'ଅନଲାଇନ୍',
    'dashboard.stats.offline': 'ଅଫଲାଇନ୍',
    'dashboard.stats.sync_ready': 'ସିଙ୍କ୍ ପାଇଁ ବିଷୟବସ୍ତୁ ପ୍ରସ୍ତୁତ',
    'dashboard.stats.sync_queue': 'ଅଫଲାଇନ୍ କ୍ୟୁ ଉପଲବ୍ଧ',
    'dashboard.stats.activities_meta': '{completed}/5 ଟି କାର୍ଯ୍ୟକଳାପ ଶେଷ ହୋଇଛି',
    'dashboard.stats.offline_meta': 'ସାପ୍ତାହିକ ବିଷୟବସ୍ତୁ ପ୍ୟାକ୍ ଡାଉନଲୋଡ୍ ହୋଇଛି',
    'dashboard.learning.title': "ଆଜିର ଶିକ୍ଷା ଯାତ୍ରା",
    'dashboard.learning.desc': 'ଜ୍ଞାନଗତ, ଭାଷା, ଶାରୀରିକ, ସୃଜନଶୀଳତା ଏବଂ ପୁଷ୍ଟିକର ପାଞ୍ଚଟି କାର୍ଯ୍ୟକଳାପ |',
    'dashboard.learning.btn': 'ସ୍କ୍ରିନ୍ ଖୋଲନ୍ତୁ',
    'dashboard.development.title': 'ଶିଶୁ ବିକାଶ',
    'dashboard.development.desc': 'ବୃଦ୍ଧି ସ୍ଥିତି ଏବଂ ସ୍ୱୟଂଚାଳିତ ଭାବେ ସୃଷ୍ଟି ହୋଇଥିବା ଅନ୍ତର୍ଦୃଷ୍ଟି ସହିତ ପ୍ରୋଫାଇଲ୍ ସ୍ନାପସଟ୍ |',
    'dashboard.development.btn': 'ପିଲାମାନଙ୍କୁ ଦେଖନ୍ତୁ',
    'dashboard.assessment.title': 'ତୁରନ୍ତ ଆକଳନ ସ୍ନାପସଟ୍',
    'dashboard.assessment.desc': 'ଦୈନନ୍ଦିନ ଶ୍ରେଣୀଗୃହ ବ୍ୟବହାର ପାଇଁ ସ୍ୱୟଂଚାଳିତ ସେଭ୍ ସହିତ ଏକ-ଟ୍ୟାପ୍ ପର୍ଯ୍ୟବେକ୍ଷଣ |',
    'dashboard.radar.title': 'ଆକଳନ ରାଡାର୍',
    'dashboard.radar.desc': 'ଜ୍ଞାନଗତ, ଭାଷା, ଶାରୀରିକ, ସାମାଜିକ ଏବଂ ସୃଜନଶୀଳତା ପ୍ରସ୍ତୁତି |',
    'dashboard.actions.title': 'ଅଭିଭାବକ ଏବଂ ଅଫଲାଇନ୍ କାର୍ଯ୍ୟ',
    'dashboard.actions.notifications': '{count} ଟି ଅଭିଭାବକ ବିଜ୍ଞପ୍ତି ପ୍ରସ୍ତୁତ',
    'dashboard.actions.meals': 'ଆଜି {count} ଟି ଖାଦ୍ୟ ଲଗ୍ ହୋଇଛି',
    'dashboard.actions.badges': '{count} ଟି ବ୍ୟାଜ୍ ପ୍ରଦାନ କରାଯାଇଛି',
    'dashboard.actions.download': 'ଅଫଲାଇନ୍ ବ୍ୟବହାର ପାଇଁ ସାପ୍ତାହିକ ବିଷୟବସ୍ତୁ ଡାଉନଲୋଡ୍ କରନ୍ତୁ',

    'common.app_name': 'ସ୍ମାର୍ଟ ଅଙ୍ଗନୱାଡି',
    'common.app_subtitle': 'ICDS + NEP 2020 ଶିକ୍ଷା OS',
    'common.confirm': 'ନିଶ୍ଚିତ କରନ୍ତୁ',
    'common.cancel': 'ବାତିଲ୍',
    'common.submit': 'ଦାଖଲ କରନ୍ତୁ',
    'common.save': 'ସେଭ୍',
    'common.search': 'ଖୋଜନ୍ତୁ',
    'common.view_all': 'ସମସ୍ତ ଦେଖନ୍ତୁ',
    'common.at_risk': 'ବିପଦରେ',
    'common.healthy': 'ସୁସ୍ଥ',
    'common.monitor': 'ନଜର ରଖନ୍ତୁ',
    'common.needs_attention': 'ଧ୍ୟାନ ଆବଶ୍ୟକ',
    'common.developing': 'ବିକାଶଶୀଳ',
    'common.on_track': 'ଠିକ୍ ପଥରେ',
    'common.saved': 'ସେଭ୍ ହୋଇଛି',
    'common.height': 'ଉଚ୍ଚତା',
    'common.weight': 'ଓଜନ',
    'common.muac': 'MUAC',
    'common.physical_growth': 'ଶାରୀରିକ ବୃଦ୍ଧି',
    'common.back': 'ପଛକୁ',
    'dashboard.actions.mark_attendance': 'ଦୈନିକ ଉପସ୍ଥିତି ଚିହ୍ନଟ',
    'dashboard.charts.attendance_trend': 'ହାରାହାରି ଉପସ୍ଥିତି ଧାରା',
    'dashboard.insights.center_alerts': 'କେନ୍ଦ୍ର ସ୍ତରୀୟ AI ସତର୍କତା',
    'status.good': 'ଭଲ',
    'status.warning': 'ସତର୍କତା',
    'status.critical': 'ଗୁରୁତର',
    'status.verb_need': 'ଆବଶ୍ୟକ',
    'status.verb_needs': 'ଆବଶ୍ୟକ',
    'insights.ai_title': 'AI-ଚାଳିତ ଅନ୍ତର୍ଦୃଷ୍ଟି',
    'insights.ai_subtitle': 'ଆପଣଙ୍କ ଶିଶୁମାନଙ୍କ ପାଇଁ ବ୍ୟକ୍ତିଗତ ସୁପାରିଶ',
    'insights.at_risk': 'ବିପଦରେ',
    'insights.nutrition_alerts': 'ପୋଷଣ ସତର୍କତା',
    'insights.learning_help': 'ଶିକ୍ଷା ସହାୟତା ଆବଶ୍ୟକ',
    'insights.on_track': 'ଠିକ୍ ପଥରେ',
    'insights.sam_critical': '{count} SAM ମାମଲା ଚିହ୍ନଟ',
    'insights.sam_message': '{names}ଙ୍କୁ ଚିକିତ୍ସା ସ୍ଥିରତା ପାଇଁ NRC କୁ ତୁରନ୍ତ ରିଫର୍ କରିବା {verb}।',
    'insights.attendance_warning': 'କମ୍ ଉପସ୍ଥିତି ଥିବା {count} ଶିଶୁ',
    'insights.attendance_message': '{names} ଏହି ମାସରେ ଅଧିକ ଅନୁପସ୍ଥିତ ଥିଲେ (ହାରାହାରି {rates}%). ଘର ପରିଦର୍ଶନ ସୁପାରିଶ।',
    'insights.learning_warning': '{count} ଶିଶୁଙ୍କୁ ଶିକ୍ଷା ସହାୟତା ଆବଶ୍ୟକ',
    'insights.learning_message': '{names} ମୂଳ ଧାରଣାରେ କଷ୍ଟ ପାଉଛନ୍ତି। ସହଜ ଚିତ୍ର ସାମଗ୍ରୀ ବ୍ୟବହାର କରନ୍ତୁ।',
    'insights.assessment_reminder': 'ଦୈନିକ ଆକଳନ ସ୍ମରଣ',
    'insights.assessment_desc': 'ଆଜି ଆପଣ ୧୨ ଶିଶୁଙ୍କ ଆକଳନ କରିନାହାନ୍ତି। ପ୍ରତି ଶିଶୁ ପାଇଁ ୩୦ ସେକେଣ୍ଡ ଲାଗେ।',
    'insights.progress_success': '{name}ଙ୍କ ଭଲ ପ୍ରଗତି',
    'insights.progress_message': 'ଗତ ମାସର ନିୟମିତ ଉପସ୍ଥିତି ପରେ ଶିକ୍ଷା ସ୍କୋର ୨୫% ବଢ଼ିଛି।',
    'insights.action.nrc': 'NRC କୁ ରିଫର୍',
    'insights.action.visits': 'ଘର ପରିଦର୍ଶନ ଯୋଜନା',
    'insights.action.easy': 'ସହଜ କାର୍ଯ୍ୟକଳାପ ଦେଖନ୍ତୁ',
    'insights.action.assessment': 'ଆକଳନ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ',
    'insights.action.profile': 'ପ୍ରୋଫାଇଲ୍ ଦେଖନ୍ତୁ',

    // Children
    'children.title': 'ପିଲାମାନଙ୍କର ନାମଲେଖା',
    'children.subtitle': 'ସମସ୍ତ ପଞ୍ଜିକୃତ ପିଲାମାନଙ୍କୁ ପରିଚାଳନା ଏବଂ ଦେଖନ୍ତୁ',
    'children.search_placeholder': 'ନାମ ଦ୍ୱାରା ପିଲାମାନଙ୍କୁ ଖୋଜନ୍ତୁ...',
    'children.no_results': 'ଆପଣଙ୍କ ସନ୍ଧାନ ସହିତ ମେଳ ଖାଉଥିବା କୌଣସି ପିଲା ମିଳିଲା ନାହିଁ |',
    'children.batch_beginner': 'ପ୍ରାରମ୍ଭିକ ବ୍ୟାଚ୍ (୩-୪ ବର୍ଷ)',
    'children.batch_intermediate': 'ମଧ୍ୟବର୍ତ୍ତୀ ବ୍ୟାଚ୍ (୪-୫ ବର୍ଷ)',
    'children.batch_advanced': 'ଉନ୍ନତ ବ୍ୟାଚ୍ (୫-୬ ବର୍ଷ)',
    'children.count_single': '{count} ପିଲା',
    'children.count_multiple': '{count} ପିଲା',

    // Domains
    'domain.cognitive': 'ଜ୍ଞାନଗତ',
    'domain.language': 'ଭାଷା',
    'domain.physical': 'ଶାରୀରିକ',
    'domain.social': 'ସାମାଜିକ',
    'domain.creativity': 'ସୃଜନଶୀଳତା',
    'domain.nutrition': 'ପୁଷ୍ଟିହୀନତା',
    'units.cm': 'ସେ.ମି.',
    'units.kg': 'କି.ଗ୍ରା.',
    'units.mm': 'ମି.ମି.',

    // Status
    'data.insight.on_track.title': 'ଶିଶୁ ବୟସ ଅନୁଯାୟୀ ଠିକ୍ ଅଛି',
    'data.insight.on_track.detail': 'ଭାଷା, ସଂଖ୍ୟା ଏବଂ ଉପସ୍ଥାନ ଧାରା କେନ୍ଦ୍ର ହାରାହାରିଠାରୁ କ୍ରମାଗତ ଭାବରେ ଅଧିକ |',
    'data.insight.needs_improvement.title': 'ଭାଷା କୌଶଳରେ ଉନ୍ନତି ଆବଶ୍ୟକ',
    'data.insight.needs_improvement.detail': 'ଶବ୍ଦାବଳୀ ମନେ ରଖିବାରେ ଉନ୍ନତି ହେଉଛି, କିନ୍ତୁ ଭାବ ପ୍ରକାଶକାରୀ ଗପ କହିବା ପାଇଁ ଏବେ ମଧ୍ୟ ମାର୍ଗଦର୍ଶନ ଆବଶ୍ୟକ |',
    'data.insight.immediate_support.title': 'ତୁରନ୍ତ ସହାୟତା ପାଇଁ ସୁପାରିଶ',
    'data.insight.immediate_support.detail': 'ପୁଷ୍ଟିକର ଖାଦ୍ୟ ଏବଂ ଉପସ୍ଥାନର ଅଭାବ ଶିକ୍ଷଣ ଶକ୍ତି ଏବଂ ଜ୍ଞାନଗତ ଅଂଶଗ୍ରହଣକୁ ପ୍ରଭାବିତ କରୁଛି |',
    'data.insight.recovering.title': 'ବୃଦ୍ଧି ଧୀରେ ଧୀରେ ସୁଧାର ହେଉଛି',
    'data.insight.recovering.detail': 'ଓଜନ ସ୍ଥିର ହେଉଛି, କିନ୍ତୁ ଖାଦ୍ୟ ଗ୍ରହଣ ଏବଂ ଘରୋଇ ଫଲୋ-ଅପ୍ ଏହି ସପ୍ତାହରେ ଜାରି ରହିବା ଉଚ୍ଚତ୍ |',
    'data.insight.intervention.title': 'ପୋଷଣ ସହାୟତା ଆବଶ୍ୟକ',
    'data.insight.intervention.detail': 'ଓଜନ ଧାରା ୨ ମାସ ଧରି ହ୍ରାସ ପାଉଛି | ତୁରନ୍ତ ଗୃହ ପରିଦର୍ଶନ ଏବଂ ଅତିରିକ୍ତ ଖାଦ୍ୟ ସମନ୍ୱୟ ଆବଶ୍ୟକ |',
    'data.insight.attendance.title': 'ନିରନ୍ତର ଉପସ୍ଥାନ',
    'data.insight.attendance.detail': 'ଏହି ମାସରେ ୯୫% ଉପସ୍ଥାନ ଦେଖାଉଛି, ଯାହା ଉନ୍ନତ ସାମାଜିକ ଦକ୍ଷତା ସହିତ ଜଡିତ |',
    'data.meal.suji_upma': 'ସୂଜି ଉପମା',
    'data.meal.rice_dalma': 'ଭାତ ଓ ଡାଲମା',
    'data.meal.khichdi': 'ପନିପରିବା ଖେଚୁଡ଼ି',
    'data.notification.growth_audit.title': 'ମାସିକ ବୃଦ୍ଧି ଅଡିଟ୍',
    'data.notification.growth_audit.msg': 'ଦୟାକରି ବ୍ୟାଚ୍ A ପାଇଁ ମାପ ସଂପୂର୍ନ୍ନ କରନ୍ତୁ |',
    'data.notification.policy_update.title': 'ନୀତି ଅପଡେଟ୍',
    'data.notification.policy_update.msg': 'ICDS ପାଇଁ ନୂତନ ଆହାର ନିର୍ଦ୍ଦେଶାବଳୀ ଜାରି କରାଯାଇଛି |',
    'data.report.week_label': 'ଏପ୍ରିଲ୍, ପ୍ରଥମ ସପ୍ତାହ',
    'data.report.summary_c1': "ଆରଭ 'ମୋ ପରିବାର' କାର୍ଯ୍ୟକଳାପରେ ବହୁତ ସକ୍ରିୟ ରହିଛନ୍ତି | ସେ ନିଜ ଘରର ଚିତ୍ର ଆଙ୍କିବାକୁ ବହୁତ ଉପଭୋଗ କରିଥିଲେ |",
    'data.report.highlight.roles': 'ଓଡିଆରେ ୫ଟି ପରିବାର ଭୂମିକା ଚିହ୍ନଟ କଲେ',
    'data.report.highlight.counting': '୧୦ ଜଣ ପରିବାର ସଦସ୍ୟଙ୍କୁ ଗଣନା କଲେ',
    'data.report.highlight.motor': 'ରଙ୍ଗ ଦେବା ଦ୍ୱାରା ସୂକ୍ଷ୍ମ ଗତିଶୀଳତା କୌଶଳରେ ଉନ୍ନତି ହେଲା',
    'data.report.suggested_home': 'ରାତ୍ରି ଭୋଜନ ସମୟରେ ଆରଭଙ୍କୁ ତାଙ୍କ ଘର ବିଷୟରେ ଭଲ ପାଉଥିବା ୩ଟି ଜିନିଷ ପଚାରନ୍ତୁ |',
    'data.insight.avg_attendance': 'ହାରାହାରି ଉପସ୍ଥାନ',
    'data.insight.malnutrition_level': 'ଅପପୁଷ୍ଟି ସ୍ତର',
    'data.insight.learning_scores': 'ଶିକ୍ଷା ସ୍କୋର',
    'data.insight.sync_status': 'ସ୍ୱାସ୍ଥ୍ୟ ରେକର୍ଡ ସିଙ୍କ୍',
    'data.badge.star_helper.title': 'ତାରକା ସହାୟକ',
    'data.badge.star_helper.description': 'ଗୋଷ୍ଠୀ କାର୍ଯ୍ୟକଳାପ ସମୟରେ ସାଥୀମାନଙ୍କୁ ସାହାଯ୍ୟ କରିବା ପାଇଁ ପ୍ରଦାନ କରାଯାଇଛି |',
    'data.theme.family': 'ମୋ ପରିବାର',
    'data.theme.animals': 'ପଶୁପକ୍ଷୀ',
    'data.theme.seasons': 'ଋତୁଗୁଡ଼ିକ',
    'data.theme.helpers': 'ସାମାଜିକ ସହାୟକ',
    'data.theme.nature': 'ପ୍ରକୃତି',
    'data.activity.match.title': 'ଗଣ ଏବଂ ମେଳାଅ',
    'data.activity.story.title': 'ଗପ କହିବା ଚକ୍ର',
    'data.activity.physical.title': 'ଡିଆଁ ଏବଂ ସନ୍ତୁଳନ',
    'data.activity.draw.title': 'ପରିବାର ଚିତ୍ର ଅଙ୍କନ',
    'data.activity.nutrition.title': 'ସୁସ୍ଥ ବନାମ ଅପପୁଷ୍ଟି',
    'data.activity.match.instructions': 'ପରିବାରର ଛବି କାର୍ଡ ବ୍ୟବହାର କରି ଶିଶୁକୁ ସଂଖ୍ୟା ଟାଇଲ୍ସ ସହ ଗଣନା ମିଳାଇବାକୁ କହନ୍ତୁ |',
    'data.activity.story.instructions': 'ପରିବାର ଅଡିଓ ପ୍ରମ୍ପ୍ଟ ବାଜାଇ ପ୍ରତ୍ୟେକ ଶିଶୁକୁ ଏକଟି ବାକ୍ୟ ଯୋଗ କରିବାକୁ କହନ୍ତୁ |',
    'data.activity.physical.instructions': 'ଚକ୍ ଦାୟରାରେ ଏକ ପଥ ତୈୟାର କରି ଶିଶୁମାନଙ୍କୁ ପ୍ରତ୍ୟେକ ପରିବାର ଭୂମିକାରେ ଡିଆଁବାକୁ କହନ୍ତୁ |',
    'data.activity.draw.instructions': 'କ୍ରେୟନ୍ସ ଦିଅନ୍ତୁ ଏବଂ ଶିଶୁମାନଙ୍କୁ ନିଜକୁ, ଏକ ଯତ୍ନକାରୀ ଏବଂ ପ୍ରିୟ ଜିନିଷ ଯୋଗ କରିବାକୁ କହନ୍ତୁ |',
    'data.activity.nutrition.instructions': 'ସ୍ଥାନୀୟ ଖାଦ୍ୟ ଫ୍ଲାଶକାର୍ଡ ଦେଖାଇ ଶିଶୁମାନଙ୍କୁ ଶକ୍ତି ପାଇଁ ଖାଦ୍ୟ ଛାଟିବାକୁ କହନ୍ତୁ |',
    'common.tag.counting': 'ଗଣନା',
    'common.tag.matching': 'ମେଳାଣ',
    'common.tag.focus': 'ଧ୍ୟାନ',
    'common.tag.listening': 'ଶ୍ରବଣ',
    'common.tag.speaking': 'କଥନ',
    'common.tag.vocabulary': 'ଶବ୍ଦଭଣ୍ଡାର',
    'common.tag.balance': 'ସନ୍ତୁଳନ',
    'common.tag.coordination': 'ସମନ୍ୱୟ',
    'common.tag.confidence': 'ଆତ୍ମବିଶ୍ୱାସ',
    'common.tag.expression': 'ଅଭିବ୍ୟକ୍ତି',
    'common.tag.fine_motor': 'ସୂକ୍ଷ୍ମ ଗତିଶୀଳତା',
    'common.tag.identity': 'ପରିଚୟ',
    'common.tag.food_awareness': 'ଖାଦ୍ୟ ସଚେତନତା',
    'common.tag.decision_making': 'ନିର୍ଣ୍ଣୟ ନେବା',
    'common.yes': 'ହଁ',
    'common.no': 'ନାହିଁ',
    'common.needs_help': 'ସାହାଯ୍ୟ ଆବଶ୍ୟକ',

    'data.badge.learner.title': 'ସକ୍ରିୟ ଶିକ୍ଷାର୍ଥୀ',
    'data.badge.learner.desc': 'ଏହି ସପ୍ତାହରେ ସମସ୍ତ ପାଞ୍ଚଟି କାର୍ଯ୍ୟକଳାପ ସମ୍ପୂର୍ଣ୍ଣ କରିଛି |',
    'data.badge.communicator.title': 'ଉତ୍ତମ ଯୋଗାଯୋଗକାରୀ',
    'data.badge.communicator.desc': 'ଗପ କହିବାରେ ଅଂଶଗ୍ରହଣ କରିଛି ଏବଂ ଆତ୍ମବିଶ୍ୱାସର ସହିତ ଉତ୍ତର ଦେଇଛି |',
    'data.badge.nutrition.title': 'ପୁଷ୍ଟିକର ଚାମ୍ପିଅନ୍',
    'data.badge.nutrition.desc': 'ସର୍ଟିଂ କାର୍ଯ୍ୟକଳାପ ସମୟରେ କ୍ରମାଗତ ଭାବରେ ସୁସ୍ଥ ଖାଦ୍ୟ ବାଛିଛି |',
    'status.months': 'ମାସ',
    'status.years': 'ବର୍ଷ',
    'status.yr': 'ବର୍ଷ',
    'status.mo': 'ମାସ',
    'status.just_now': 'ଏବେ',
    'status.min_ago': '{count} ମିନିଟ୍ ପୂର୍ବରୁ',
    'status.hr_ago': '{count} ଘଣ୍ଟା ପୂର୍ବରୁ',
    'status.day_ago': '{count} ଦିନ ପୂର୍ବରୁ',

    // Learning Module
    'learning.hero.badge': "ଆଜିର ଶିକ୍ଷା ଯାତ୍ରା",
    'learning.hero.title': 'ଅଙ୍ଗନୱାଡି ଶ୍ରେଣୀଗୃହ ପାଇଁ ଏକ ବିସ୍ତୃତ ଶିକ୍ଷାଦାନ କାର୍ଯ୍ୟକ୍ଷେତ୍ର |',
    'learning.hero.desc': 'ବିଷୟବସ୍ତୁ-ଆଧାରିତ ଦୈନନ୍ଦିନ ଶିକ୍ଷା, ବିସ୍ତୃତ ଶିକ୍ଷାଦାନ ମଡ୍ୟୁଲ୍, 3D ଆକାର ଅନୁସନ୍ଧାନ, କାହାଣୀ କହିବା ଭିଡିଓ, ବ୍ୟାୟାମ ଏବଂ ଶ୍ରେଣୀଗୃହ ଆକଳନ ଏକ ପ୍ରବାହରେ |',
    'learning.stats.theme_active': 'ସକ୍ରିୟ ବିଷୟବସ୍ତୁ',
    'learning.stats.modules': 'ଶିକ୍ଷାଦାନ ମଡ୍ୟୁଲ୍',
    'learning.stats.videos': 'କାହାଣୀ ଭିଡିଓ',
    'learning.stats.assessment': 'ଆକଳନ ସ୍ଥିତି',
    'learning.stats.autosave': 'ଅଟୋ-ସେଭ୍ ସକ୍ଷମ',
    'learning.theme.title': 'ମାସିକ ବିଷୟ ଚୟନକର୍ତ୍ତା',
    'learning.theme.desc': 'ବିଷୟ ଚୟନ ସହିତ କାର୍ଯ୍ୟକଳାପ, ଭିଡିଓ, ମଡ୍ୟୁଲ୍ ଏବଂ ଅଭ୍ୟାସ କାର୍ଯ୍ୟ ସ୍ୱୟଂଚାଳିତ ଭାବରେ ଅପଡେଟ୍ ହୁଏ |',
    'learning.modules.title': 'ଶିକ୍ଷାଦାନ ମଡ୍ୟୁଲ୍',
    'learning.modules.desc': 'ଉଦ୍ଦେଶ୍ୟ, ସାମଗ୍ରୀ, ପଦକ୍ଷେପ-ପ୍ରବାହ ଏବଂ ଶିଶୁ କାର୍ଯ୍ୟ ସହିତ ବିସ୍ତୃତ ଶିକ୍ଷାଦାନ ମଡ୍ୟୁଲ୍ |',
    'learning.modules.start': 'ମଡ୍ୟୁଲ୍ ଆରମ୍ଭ କରନ୍ତୁ',
    'learning.modules.flow': 'ଶିକ୍ଷକ ପ୍ରବାହ',
    'learning.modules.tasks': 'ଶିଶୁ କାର୍ଯ୍ୟ ଏବଂ ସାମଗ୍ରୀ',
    'learning.activity.title': 'ଦୈନନ୍ଦିନ କାର୍ଯ୍ୟକଳାପ ଇଞ୍ଜିନ୍',
    'learning.activity.desc': 'ପ୍ରତ୍ୟକ୍ଷ ଶ୍ରେଣୀଗୃହ ବ୍ୟବହାର ପାଇଁ ପାଞ୍ଚଟି ଗଠିତ କାର୍ଯ୍ୟକଳାପ କାର୍ଡ |',
    'learning.activity.detail': 'ଚୟନିତ କାର୍ଯ୍ୟକଳାପ ବିବରଣୀ',
    'learning.activity.mins': '{count} ମିନିଟ୍',
    'learning.shapes.title': '3D ଆକାର ଷ୍ଟୁଡିଓ',
    'learning.shapes.desc': 'ଶ୍ରେଣୀଗୃହ ଉଦାହରଣ, ମୁଖ୍ୟ ବିନ୍ଦୁ ଏବଂ ମିନି କାର୍ଯ୍ୟ ସହିତ ପ୍ରତ୍ୟକ୍ଷ 3D ଆକାର ଶିକ୍ଷାଦାନ |',
    'learning.shapes.concept': '3D ଧାରଣା',
    'learning.shapes.minitask': 'ମିନି କାର୍ଯ୍ୟ: {task}',
    'learning.videos.title': 'କାହାଣୀ କହିବା ଭିଡିଓ ସେଲଫ୍',
    'learning.videos.desc': 'ଭାଷା ସମର୍ଥନ, ଆଲୋଚନା ପ୍ରସଙ୍ଗ ଏବଂ ଶିକ୍ଷା ଲକ୍ଷ୍ୟ ସହିତ ଭିଡିଓ-ପ୍ରସ୍ତୁତ କାହାଣୀ କହିବା ମଡ୍ୟୁଲ୍ |',
    'learning.videos.goals': 'ଶିକ୍ଷା ଲକ୍ଷ୍ୟ',
    'learning.videos.prompts': 'ଆଲୋଚନା ପ୍ରସଙ୍ଗ',

    // Themes
    'theme.family': 'ମୋ ପରିବାର',
    'theme.animals': 'ପଶୁପକ୍ଷୀ',
    'theme.seasons': 'ଋତୁଗୁଡିକ',
    'theme.helpers': 'ସାମାଜିକ ସହାୟକ',

    // Nutrition Module
    'nutrition.title': 'ସ୍ୱାସ୍ଥ୍ୟ ଓ ପୁଷ୍ଟିକର ଖାଦ୍ୟ',
    'nutrition.subtitle': 'ମିଲ୍ ଲଗିଂ, ବୃଦ୍ଧି ଟ୍ରାକିଂ, ସ୍ୱାସ୍ଥ୍ୟ ସତର୍କତା ଏବଂ ଅଫଲାଇନ୍ ସାପ୍ତାହିକ ବିଷୟବସ୍ତୁ ସମର୍ଥନ |',
    'nutrition.btn_download': 'ସାପ୍ତାହିକ ବିଷୟବସ୍ତୁ ଡାଉନଲୋଡ୍ କରନ୍ତୁ',
    'nutrition.stats.meals': 'ଦୈନନ୍ଦିନ ମିଲ୍ ଲଗ୍',
    'nutrition.stats.underweight': 'କମ୍ ଓଜନ ସତର୍କତା',
    'nutrition.stats.missed': 'ଅଭାବୀ ପୁଷ୍ଟିକର ଖାଦ୍ୟ',
    'nutrition.chart.title': 'ବୃଦ୍ଧି ଟ୍ରାକିଂ ଚାର୍ଟ',
    'nutrition.chart.desc': 'ନାମ ଲେଖାଇଥିବା ପିଲାମାନଙ୍କ ପାଇଁ ହାରାହାରି ଉଚ୍ଚତା ଏବଂ ଓଜନର ଧାରା |',
    'nutrition.alerts.title': 'ସ୍ୱାସ୍ଥ୍ୟ ସତର୍କତା',
    'nutrition.alerts.desc': 'ପୁଷ୍ଟିକର ଖାଦ୍ୟ ଅନୁସରଣ ପରାମର୍ଶ ଦିଆଯାଇଛି |',
    'nutrition.offline.title': 'ଅଫଲାଇନ୍ ବିଷୟବସ୍ତୁ ପ୍ୟାକ୍',
    'nutrition.offline.items': '{count} ଟି ଶିକ୍ଷା ସାମଗ୍ରୀ',
    'nutrition.offline.ready': 'ଡାଉନଲୋଡ୍ ପାଇଁ ପ୍ରସ୍ତୁତ',
    'nutrition.offline.synced': '{time} ପୂର୍ବରୁ ସିଙ୍କ୍ ହୋଇଛି',

    // Parent Engagement
    'parents.title': 'ଅଭିଭାବକ ସହଭାଗିତା',
    'parents.subtitle': 'ସେୟାର୍ ଯୋଗ୍ୟ ସାପ୍ତାହିକ ରିପୋର୍ଟ, ମିଲ୍ ଏବଂ ଉପସ୍ଥାନ ଅପଡେଟ୍, ଟୀକାକରଣ ସ୍ମୃତି ଏବଂ ଗୃହ କାର୍ଯ୍ୟକଳାପ ପରାମର୍ଶ |',
    'parents.btn_share': 'ସାପ୍ତାହିକ ରିପୋର୍ଟ ସେୟାର୍ କରନ୍ତୁ',
    'parents.stats.families': 'ପରିବାର ପାଖରେ ପହଞ୍ଚିଛି',
    'parents.stats.notifications': 'ଏହି ସପ୍ତାହର ବିଜ୍ଞପ୍ତି',
    'parents.stats.home_activities': 'ପରିକଳ୍ପିତ ଗୃହ କାର୍ଯ୍ୟକଳାପ',
    'parents.report.child_report': 'ଶିଶୁ ରିପୋର୍ଟ',
    'parents.report.shareable': 'ସେୟାର୍ ଯୋଗ୍ୟ',
    'parents.report.skills_learned': 'ଶିଖିଥିବା ଦକ୍ଷତା',
    'parents.report.areas_improve': 'ଉନ୍ନତିର ଆବଶ୍ୟକତା ଥିବା କ୍ଷେତ୍ର',
    'parents.report.home_activities': 'ଗୃହ କାର୍ଯ୍ୟକଳାପ',
    'parents.report.notifications': 'ବିଜ୍ଞପ୍ତି',

    // Progress types
    'progress.attendance': 'ଉପସ୍ଥାନ',
    'progress.nutrition': 'ପୁଷ୍ଟିକର ଖାଦ୍ୟ',
    'progress.learning': 'ପାଠପଢ଼ା',

    // Board / Teaching Tools
    'board.chalk_board': 'କଳା ବୋର୍ଡ',
    'board.subtitle': 'ପାଠପଢ଼ା, ଚିତ୍ରାଙ୍କନ ଓ ଶିକ୍ଷାଦାନ ପାଇଁ ବୋର୍ଡ',
    'board.tool.pen': 'ପେନ୍',
    'board.tool.highlighter': 'ହାଇଲାଇଟର୍',
    'board.tool.eraser': 'ଇରେଜର',
    'board.tool.shapes': 'ଆକୃତି',
    'board.tool.text': 'ଲେଖା',
    'board.tool.stamps': 'ଷ୍ଟାମ୍ପ',
    'board.tool.tracing': 'ଲେଖିବା ଶିକ୍ଷା',
    'board.tool.tools': 'ଉପକରଣ',
    'board.tool.size': 'ଆକାର',
    'board.tool.color': 'ରଙ୍ଗ',
    'board.tool.theme': 'ବୋର୍ଡ ବିଷୟବସ୍ତୁ',
    'board.new_page': 'ନୂଆ ପୃଷ୍ଠା',
    'board.fullscreen': 'ଫୁଲ୍ ସ୍କ୍ରିନ୍',
    'board.exit_fullscreen': 'ଫୁଲ୍ ସ୍କ୍ରିନ୍ ରୁ ବାହାରନ୍ତୁ',
    'board.stamps.reward': 'ପୁରସ୍କାର ଷ୍ଟାମ୍ପ',
    'board.tracing.guide': 'ଲେଖିବା ଗାଇଡ୍',
    'board.teaching_tools': 'ଶିକ୍ଷାଦାନ ଉପକରଣ',
    'board.timer': 'ଟାଇମର୍',
    'board.dice': 'ଛକା',
    'board.random_student': 'ଯଦୃଚ୍ଛା ଛାତ୍ର',
    'board.color.black': 'କଳା',
    'board.color.white': 'ଧଳା',
    'board.color.yellow': 'ହଳଦିଆ',
    'board.color.pink': 'ଗୋଲାପୀ',
    'board.color.blue': 'ଆକାଶୀ ନୀଳ',
    'board.color.orange': 'କମଳା',
    'board.color.lime': 'ଲେମ୍ବୁ ସବୁଜ',
    'board.color.red': 'ନାଲି',
    'board.color.violet': 'ବାଇଗଣୀ',
    'board.tracing.odia_vowels': 'ଓଡ଼ିଆ ସ୍ୱରବର୍ଣ୍ଣ',
    'board.tracing.odia_consonants': 'ଓଡ଼ିଆ ବ୍ୟଞ୍ଜନ',
    'board.tracing.hindi_vowels': 'ହିନ୍ଦୀ ସ୍ଵରବର୍ଣ୍ଣ',
    'board.tracing.hindi_consonants': 'ହିନ୍ଦୀ ବ୍ୟଞ୍ଜନ',
    'board.tracing.english_upper': 'ଇଂରାଜୀ ବଡ ଅକ୍ଷର (A-Z)',
    'board.tracing.english_lower': 'ଇଂରାଜୀ ସାନ ଅକ୍ଷର (a-z)',
    'board.tracing.numbers': 'ସଂଖ୍ୟା (୦-୯)',
    'board.tracing.shapes': 'ଆକୃତି',
    'board.tracing.patterns': 'ଲେଖିବା ପୂର୍ବ ନମୁନା',
    'board.stamps.star': 'ତାରକା',
    'board.stamps.correct': 'ସଠିକ୍',
    'board.stamps.love': 'ଭଲପାଇବା',
    'board.stamps.good': 'ଭଲ',
    'board.stamps.happy': 'ଖୁସି',
    'board.stamps.winner': 'ବିଜେତା',

    // Admin & Supervisor Analytics
    'admin.district_dashboard': 'ଜିଲ୍ଲା ଡ୍ୟାସବୋର୍ଡ',
    'admin.ai_powered': 'AI- ଚାଳିତ ବିଶ୍ଳେଷଣ',
    'admin.block_performance': 'ବ୍ଲକ୍ ସ୍ତରୀୟ ପ୍ରଦର୍ଶନ',
    'admin.trend_6month': '୬ ମାସର ଧାରା',
    'admin.heatmap_title': 'ବ୍ଲକ୍ ସ୍ତରୀୟ ପ୍ରଦର୍ଶନ ହିଟ୍-ମ୍ୟାପ୍',
    'admin.learning_improvement': 'ଶିକ୍ଷା ଦାନରେ ଉନ୍ନତି',
    'admin.malnutrition_reduction': 'ଅପପୁଷ୍ଟି ହ୍ରାସ',
    'admin.nutrition_risk': 'ପୁଷ୍ଟିକର ଖାଦ୍ୟ ବିପଦ',
    'supervisor.dashboard_title': 'ପର୍ଯ୍ୟବେକ୍ଷକ ଡ୍ୟାସବୋର୍ଡ',
    'supervisor.block_overview': 'ଛତ୍ରପୁର ବ୍ଲକ · ଗଞ୍ଜାମ ଜିଲ୍ଲା — ବ୍ଲକ ସ୍ତରୀୟ ସମୀକ୍ଷା',
    'supervisor.total_children': 'ମୋଟ ଶିଶୁ',
    'supervisor.nutrition_risk': 'ପୁଷ୍ଟିକର ଖାଦ୍ୟ ବିପଦ',
    'supervisor.avg_learning': 'ହାରାହାରି ଶିକ୍ଷା ସ୍କୋର',
    'supervisor.critical_cases': 'ଗୁରୁତର ମାମଲା',
    'supervisor.awc_performance': 'କେନ୍ଦ୍ର ଅନୁଯାୟୀ ପ୍ରଦର୍ଶନ',
    'supervisor.nutrition_categories': 'ପୁଷ୍ଟିଶାସନ ବର୍ଗ',
    'supervisor.all_clear': 'ସବୁ ଠିକ୍ ଅଛି',
    'supervisor.alerts_count': '{count} ସତର୍କତା',
    'supervisor.awc_detail': 'କେନ୍ଦ୍ରର ବିବରଣୀ',
    'supervisor.active_alerts': 'ସକ୍ରିୟ ସତର୍କତା',
    'supervisor.present_today': 'ଆଜିର ଉପସ୍ଥିତି',
    'supervisor.enrolled_count': 'ନାମ ଲେଖାଇଥିବା ପିଲା ({count})',

    'supervisor.kpi.total_children': 'ମୋଟ ପିଲା',
    'supervisor.kpi.nutrition_risk': 'ପୁଷ୍ଟିହୀନତା ବିପଦ',
    'supervisor.kpi.avg_learning': 'ହାରାହାରି ଶିକ୍ଷଣ ସ୍କୋର',
    'supervisor.kpi.critical_cases': 'ଗୁରୁତର ମାମଲା',
    'supervisor.kpi.present_today': 'ଆଜି {count} ଉପସ୍ଥିତ',
    'supervisor.kpi.nutrition_sub': '{sam} SAM · {mam} MAM',
    'supervisor.chart.awc_performance': 'AWC ଅନୁଯାୟୀ ପ୍ରଦର୍ଶନ',
    'supervisor.chart.learning': 'ଶିକ୍ଷଣ %',
    'supervisor.chart.attendance': 'ଉପସ୍ଥାନ %',
    'supervisor.chart.nutrition_categories': 'ପୁଷ୍ଟିକର ବର୍ଗ',
    'supervisor.table.title': 'ଅଙ୍ଗନୱାଡି କେନ୍ଦ୍ର ସମୂହ',
    'supervisor.table.centre_name': 'କେନ୍ଦ୍ରର ନାମ',
    'supervisor.table.worker': 'କର୍ମୀ',
    'supervisor.table.status': 'ସ୍ଥିତି',
    'supervisor.table.children': 'ପିଲାମାନେ',
    'supervisor.table.learning': 'ଶିକ୍ଷଣ',
    'supervisor.table.attendance': 'ଉପସ୍ଥାନ',
    'supervisor.table.alerts': 'ସତର୍କତା',
    'supervisor.table.all_clear': 'ସବୁ ଠିକ୍ ଅଛି',
    'supervisor.table.alerts_count': '{count} ସତର୍କତା',
    'awc_detail.not_found': 'ଅଙ୍ଗନୱାଡି କେନ୍ଦ୍ର ମିଳିଲା ନାହିଁ |',
    'awc_detail.back': 'ପଛକୁ ଫେରନ୍ତୁ',
    'awc_detail.active_alerts': 'ସକ୍ରିୟ ସତର୍କତା',
    'awc_detail.present_today': 'ଆଜି ଉପସ୍ଥିତି',
    'awc_detail.avg_learning': 'ହାରାହାରି ଶିକ୍ଷଣ',
    'awc_detail.attendance_rate': 'ଉପସ୍ଥାନ ହାର',
    'awc_detail.critical_cases': 'ଗୁରୁତର ମାମଲା',
    'awc_detail.nutrition_breakdown': 'ପୁଷ୍ଟିକର ସ୍ଥିତି ବିବରଣୀ',
    'awc_detail.children_enrolled': 'ମୋଟ ପଞ୍ଜୀକୃତ ପିଲା ({count})',
    'awc_detail.table.name': 'ନାମ',
    'awc_detail.table.age': 'ବୟସ',
    'awc_detail.table.learning': 'ଶିକ୍ଷଣ',
    'awc_detail.table.nutrition': 'ପୁଷ୍ଟିକର',
    'awc_detail.table.attendance': 'ଉପସ୍ଥାନ',
    'awc_detail.table.risk': 'ବିପଦ',
    'district.dashboard_title': 'ଜିଲ୍ଲା ଡ୍ୟାସବୋର୍ଡ',
    'district.subtitle': 'କଳାହାଣ୍ଡି ଜିଲ୍ଲା · ICDS, ଓଡିଶା - ଜିଲ୍ଲା ସ୍ତରୀୟ ସମୀକ୍ଷା',
    'district.ai_analytics': 'AI- ପରିଚାଳିତ ସମୀକ୍ଷା',
    'district.kpi.total_awcs': 'ମୋଟ ଅଙ୍ଗନୱାଡି କେନ୍ଦ୍ର',
    'district.kpi.total_children': 'ମୋଟ ପିଲା',
    'district.kpi.learning_improvement': 'ଶିକ୍ଷା ↑',
    'district.kpi.malnutrition_reduction': 'ଅପୁଷ୍ଟି ↓',
    'district.kpi.avg_attendance': 'ହାରାହାରି ଉପସ୍ଥାନ',
    'district.kpi.active_alerts': 'ସକ୍ରିୟ ସତର୍କତା',
    'district.kpi.sub_improvement': 'ଉନ୍ନତି',
    'district.kpi.sub_reduction': 'ହ୍ରାସ',
    'district.chart.block_performance': 'ବ୍ଲକ ଅନୁଯାୟୀ ପ୍ରଦର୍ଶନ',
    'district.chart.trend_6months': '୬ ମାସର ଧାରା',
    'district.chart.avg_learning': 'ହାରାହାରି ଶିକ୍ଷଣ %',
    'district.chart.nutrition_risk': 'ପୁଷ୍ଟିହୀନତା ବିପଦ %',
    'district.heatmap.title': 'ବ୍ଲକ ଅନୁଯାୟୀ ପ୍ରଦର୍ଶନ ହିଟମ୍ୟାପ୍',
    'district.heatmap.awcs': 'ଅଙ୍ଗନୱାଡି କେନ୍ଦ୍ର',
    'district.heatmap.children': 'ପିଲାମାନେ',
    'district.heatmap.learning': 'ଶିକ୍ଷଣ',
    'district.heatmap.nutrition_risk': 'ପୁଷ୍ଟିହୀନତା ବିପଦ',
    'district.heatmap.performance_legend': 'ପ୍ରଦର୍ଶନ:',
    'risk.low': 'କମ୍',
    'risk.medium': 'ମଧ୍ୟମ',
    'risk.high': 'ଅଧିକ',
    'months.jan': 'ଜାନୁୟାରୀ',
    'months.feb': 'ଫେବୃଆରୀ',
    'months.mar': 'ମାର୍ଚ୍ଚ',
    'months.apr': 'ଅପ୍ରେଲ',
    'months.may': 'ମେ',
    'months.jun': 'ଜୁନ୍',
    'months.jul': 'ଜୁଲାଇ',
    'months.aug': 'ଅଗଷ୍ଟ',
    'months.sep': 'ସେପ୍ଟେମ୍ବର',
    'months.oct': 'ଅକ୍ଟୋବର',
    'months.nov': 'ନଭେମ୍ବର',
    'months.dec': 'ଡିସେମ୍ବର',
    'arunima.title': 'ଅରୁଣିମା ପୁସ୍ତିକା',
    'arunima.progress': 'ପ୍ରଗତି',
    'arunima.modules': 'ମଡ୍ୟୁଲ୍',
    'arunima.activity': 'କାର୍ଯ୍ୟକଳାପ',
    'arunima.areas_for_improvement': 'ସୁଧାର ପାଇଁ କ୍ଷେତ୍ର',
    'arunima.competency': 'ଦକ୍ଷତା',
    'arunima.level_advanced': 'ଉନ୍ନତ',
    'arunima.level_developing': 'ବିକାଶଶୀଳ',
    'arunima.level_emerging': 'ଉଦୟମାନ',
    'arunima.level_proficient': 'ଦକ୍ଷ',
    'arunima.milestone': 'ମାଇଲସ୍ଟୋନ୍',
    'arunima.next_steps': 'ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ',
    'arunima.overall_progress': 'ସମୁଦାୟ ପ୍ରଗତି',
    'arunima.recommendations': 'ସୁପାରିଶ',
    'arunima.select_student': 'ଛାତ୍ର ବାଛନ୍ତୁ',
    'arunima.strengths': 'ଶକ୍ତିଗୁଡିକ',
    'arunima.student_report': 'ଛାତ୍ର ରିପୋର୍ଟ',
    'arunima.view_report': 'ରିପୋର୍ଟ ଦେଖନ୍ତୁ',
    'board.labels.actions': 'କାର୍ଯ୍ୟ',
    'board.labels.draw': 'ଆକନ୍ତୁ',
    'board.labels.insert': 'ସଂଯୋଜନ',
    'board.pages.page_of': '{total} ମଧ୍ୟରୁ ପୃଷ୍ଠା {current}',
    'board.tools.pause': 'ବିରତି',
    'board.tools.pick': 'ବାଛନ୍ତୁ',
    'board.tools.roll': 'ରୋଲ୍',
    'board.tools.start': 'ଆରମ୍ଭ',
    'board.tracing.trace_message': 'ଅଭ୍ୟାସ ପାଇଁ ଗାଇଡ୍ ଉପରେ ଟ୍ରେସ୍ କରନ୍ତୁ।',
    'children.card.assess': 'ମୂଲ୍ୟାୟନ',
    'children.card.attendance': 'ଉପସ୍ଥାନ',
    'children.card.learning': 'ଶିକ୍ଷା',
    'children.card.view_metrics': 'ମେଟ୍ରିକ୍ସ ଦେଖନ୍ତୁ',
    'children.filter.showing': '{count} ଜଣ ପିଲା ଦେଖାଯାଉଛନ୍ତି',
    'children.no_results_desc': 'ଅଧିକ ପିଲା ଦେଖିବା ପାଇଁ ସନ୍ଧାନ କିମ୍ବା ଫିଲ୍ଟର ବଦଳାନ୍ତୁ।',
    'common.no_results': 'କୌଣସି ଫଳାଫଳ ମିଳିଲା ନାହିଁ',
    'dashboard.charts.attendance_desc': 'କେନ୍ଦ୍ର ଜୁଡି ଏହି ସପ୍ତାହର ଉପସ୍ଥାନ ଧାରା।',
    'dashboard.charts.nutrition_desc': 'ପଞ୍ଜିକୃତ ପିଲାମାନଙ୍କର ପୁଷ୍ଟି ସ୍ଥିତି ବିଭାଜନ।',
    'dashboard.insights': 'AI ଅନ୍ତର୍ଦୃଷ୍ଟି',
    'dashboard.insights.attendance_drop_msg': 'ଶେଷ ତିନି ଦିନରେ ଉପସ୍ଥାନ କମିଛି। ଅନୁପସ୍ଥିତ ପରିବାରମାନଙ୍କ ସହିତ ସମ୍ପର୍କ କରନ୍ତୁ।',
    'dashboard.insights.sam_critical_msg': 'ଏକ ପିଲାକୁ ତୁରନ୍ତ ପୁଷ୍ଟି ଫଲୋ-ଅପ୍ ଏବଂ ରିଫରାଲ୍ ସହାୟତା ଆବଶ୍ୟକ।',
    'dashboard.stats.attendance': 'ଉପସ୍ଥାନ',
    'dashboard.stats.avg_learning': 'ହାରାହାରି ଶିକ୍ଷା',
    'dashboard.stats.enrolled': 'ପଞ୍ଜିକୃତ',
    'dashboard.stats.nutrition_alerts': 'ପୁଷ୍ଟି ସତର୍କତା',
    'dashboard.stats.offline_packs': 'ଅଫଲାଇନ୍ ପ୍ୟାକ୍',
    'dashboard.stats.stars_earned': 'ଅର୍ଜିତ ତାରା',
    'locale': 'od',
    'nutrition.normal': 'ସାଧାରଣ',
    'nutrition.mam': 'MAM',
    'nutrition.sam': 'SAM',
    'status.average': 'ସାଧାରଣ',
    'status.poor': 'ଦୁର୍ବଳ',
  },
};
