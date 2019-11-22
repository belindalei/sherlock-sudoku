class V1::GamesController < ApplicationController
  def index
    render json: { :games => [
      {
        :name => 'some-thing',
        :guid => '041567'
      }
    ] }.to_json
    end
end