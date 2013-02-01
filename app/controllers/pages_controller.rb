class PagesController < ApplicationController
  before_filter :authenticate_user!, :only => [ :dashboard, :network ]
  before_filter :activity, :only => [:community, :dashboard]

  def index
    if current_user.nil? or current_user.person.nil?
      render
    elsif Settings.invitations == 'true' and not current_user.person.authorised?
      render
    else
      flash.keep 
      redirect_to dashboard_path
    end
  end

  def dashboard
    unless current_user.person.activity_logs.empty?
      @recent_activity_logs = current_user.person.recent_activity_logs
      @recent_activity_dates = @recent_activity_logs.group_by {|r| r.updated_at.strftime("%B %d")}
    end
    current_user.person.reset_notification_count!
    current_user.record_last_activity!
    current_user.person.news_feed
    @events = current_user.network_activity.page(params[:page]).per(5)
  end

  def community
    @entities = Entity.groups_with_person(current_person)
    @entity = Entity.find_by_id(params[:entity_id]) unless params[:entity_id].nil?

    if params[:type] == 'trusted'
      
      @items = current_person.trusted_friends_items(params[:filter_type]).sort_by{|i| i.item_type.downcase}
      @events = current_person.trusted_network_activity.page(params[:page]).per(25)
    elsif params[:type] == 'village'
      @items = current_person.villages_items(params[:filter_type]).sort_by{|i| i.item_type.downcase}
      @events= current_person.villages_activity.page(params[:page]).per(25)
    elsif params[:type] == 'Groups'
      @items = current_person.groups_items(params[:filter_type]).sort_by{|i| i.item_type.downcase}
      @events= current_person.groups_activity.page(params[:page]).per(25)
      
      
    
    
    
    
    
    
    
    elsif !@entity.nil?
      @items = ResourceNetwork.items_belong_to(@entity.specific_entity)
      @events = @entity.network_activity.page(params[:page]).per(25)
    else
      @items = ResourceNetwork.all_items_from(@entities).sort_by{|i| i.item_type.downcase}
      @items ||= []
      @items += current_person.personal_network_items(params[:filter_type]).sort_by{|i| i.item_type.downcase}
      @events = current_person.network_activity.page(params[:page]).per(25)
    end
  end

  def about
    about_layout = ((current_user.nil?  || !current_user.person.authorised_account || !current_user.person.accepted_pp?) ? 'shared_earth' : 'application')
    render :layout => about_layout
  end

  def contribute
    contribute_layout = ((current_user.nil?  || !current_user.person.authorised_account || !current_user.person.accepted_pp?) ? 'shared_earth' : 'application')
    render :layout => contribute_layout
  end

  def no_javascript
    render :layout => 'welcome'
  end

  def collect_email
    render :layout => nil
  end

  def activity
    @active_item_requests     = current_user.person.active_item_requests
    @network_requests  = current_user.person.received_network_requests +
                                current_user.person.network_requests
    @requests = @active_item_requests + @network_requests

    @requests.sort! { |a,b| b.created_at <=> a.created_at }

    @request_dates = @requests.group_by {|r| r.updated_at.strftime("%B %d")}

    @item_types = ItemType.all
    @items = Item.all
    @people = Person.all
  end
end