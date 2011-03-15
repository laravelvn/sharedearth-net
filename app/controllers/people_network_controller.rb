class PeopleNetworkController < ApplicationController
  before_filter :authenticate_user!
  # TODO add some verification who can destroy people network

  def destroy
    @people_network = PeopleNetwork.find(params[:id])
    trusted_person = @people_network.trusted_person
    PeopleNetwork.involves(@people_network.person).involves(@people_network.trusted_person).limit(2).destroy_all
    redirect_to(trusted_person, :notice => I18n.t('messages.people_network.destroy'))
  end
end
